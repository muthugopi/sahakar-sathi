import type { CookieOptions, Request, Response } from 'express';
import { loginSchema, registerSchema } from '@sahakar/shared';
import { isProd } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as authService from '../services/auth.service.js';
import type { IssuedSession } from '../services/auth.service.js';

const REFRESH_COOKIE = 'sahakar_rt';
const REFRESH_COOKIE_PATH = '/api/v1/auth';

function refreshCookieOptions(expires: Date): CookieOptions {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: REFRESH_COOKIE_PATH,
    expires,
  };
}

function sendSession(res: Response, session: IssuedSession, status = 200) {
  res.cookie(REFRESH_COOKIE, session.refreshToken, refreshCookieOptions(session.refreshExpiresAt));
  res.status(status).json({ user: session.user, accessToken: session.accessToken });
}

function sessionContext(req: Request) {
  return { userAgent: req.header('user-agent') ?? undefined };
}

export const registerHandler = asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  const session = await authService.register(input, sessionContext(req));
  sendSession(res, session, 201);
});

export const loginHandler = asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const session = await authService.login(input, sessionContext(req));
  sendSession(res, session);
});

export const refreshHandler = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  if (!token) throw AppError.unauthorized('No active session.');
  const session = await authService.refresh(token, sessionContext(req));
  sendSession(res, session);
});

export const logoutHandler = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  await authService.logout(token);
  res.clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_PATH });
  res.status(204).end();
});

export const meHandler = asyncHandler(async (req, res) => {
  if (!req.auth) throw AppError.unauthorized();
  const user = await authService.getUserById(req.auth.sub);
  res.json({ user });
});
