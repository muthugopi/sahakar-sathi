import type { Prisma, User } from '@prisma/client';
import type { LoginInput, PublicUser, RegisterInput, UserRole, LanguageCode } from '@sahakar/shared';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/AppError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import {
  durationToMs,
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
} from '../utils/tokens.js';

export interface IssuedSession {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

interface SessionContext {
  userAgent?: string;
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role as UserRole,
    preferredLanguage: user.preferredLanguage as LanguageCode,
    district: user.district,
    state: user.state,
    createdAt: user.createdAt.toISOString(),
  };
}

async function issueSession(user: User, ctx: SessionContext): Promise<IssuedSession> {
  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role as UserRole,
    lang: user.preferredLanguage as LanguageCode,
  });

  const { token, tokenHash } = generateRefreshToken();
  const refreshExpiresAt = new Date(Date.now() + durationToMs(env.REFRESH_TOKEN_TTL));

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: refreshExpiresAt,
      userAgent: ctx.userAgent?.slice(0, 255),
    },
  });

  return { user: toPublicUser(user), accessToken, refreshToken: token, refreshExpiresAt };
}

export async function register(input: RegisterInput, ctx: SessionContext): Promise<IssuedSession> {
  const or: Prisma.UserWhereInput[] = [];
  if (input.email) or.push({ email: input.email });
  if (input.phone) or.push({ phone: input.phone });

  const existing = await prisma.user.findFirst({ where: { OR: or } });
  if (existing) {
    throw AppError.conflict('An account with that email or phone already exists.');
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      passwordHash,
      role: input.role as UserRole,
      preferredLanguage: input.preferredLanguage,
      district: input.district ?? null,
      state: input.state ?? null,
    },
  });

  logger.info({ userId: user.id, role: user.role }, 'user registered');
  return issueSession(user, ctx);
}

export async function login(input: LoginInput, ctx: SessionContext): Promise<IssuedSession> {
  const identifier = input.identifier.trim().toLowerCase();
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: input.identifier.trim() }] },
  });

  // Uniform failure — do not reveal whether the account exists.
  const genericFailure = AppError.unauthorized('Incorrect email/phone or password.');

  if (!user) {
    // Still spend time hashing to blunt timing analysis.
    await verifyPassword(
      '$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      input.password,
    );
    throw genericFailure;
  }
  if (!user.isActive) throw AppError.forbidden('This account has been deactivated.');

  const ok = await verifyPassword(user.passwordHash, input.password);
  if (!ok) throw genericFailure;

  logger.info({ userId: user.id }, 'user logged in');
  return issueSession(user, ctx);
}

/**
 * Rotate a refresh token. Detects reuse of an already-revoked token and, when
 * seen, revokes every active token for that user (assume compromise).
 */
export async function refresh(rawToken: string, ctx: SessionContext): Promise<IssuedSession> {
  const tokenHash = hashRefreshToken(rawToken);
  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record) throw AppError.unauthorized('Your session has expired. Please sign in again.');

  if (record.revokedAt) {
    logger.warn({ userId: record.userId }, 'refresh token reuse detected — revoking all sessions');
    await prisma.refreshToken.updateMany({
      where: { userId: record.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw AppError.unauthorized('Your session is no longer valid. Please sign in again.');
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });
    throw AppError.unauthorized('Your session has expired. Please sign in again.');
  }

  if (!record.user.isActive) throw AppError.forbidden('This account has been deactivated.');

  // Rotate: revoke the presented token, issue a fresh pair.
  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { revokedAt: new Date() },
  });

  return issueSession(record.user, ctx);
}

export async function logout(rawToken: string | undefined): Promise<void> {
  if (!rawToken) return;
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashRefreshToken(rawToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getUserById(id: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || !user.isActive) throw AppError.unauthorized();
  return toPublicUser(user);
}
