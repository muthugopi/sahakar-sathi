import { createReadStream } from 'node:fs';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { env } from '../config/env.js';
import { AppError } from './AppError.js';

/** Accepted document / photo types for grievance evidence. */
const ALLOWED = {
  'application/pdf': { ext: '.pdf', magic: [[0x25, 0x50, 0x44, 0x46]] }, // %PDF
  'image/jpeg': { ext: '.jpg', magic: [[0xff, 0xd8, 0xff]] },
  'image/png': { ext: '.png', magic: [[0x89, 0x50, 0x4e, 0x47]] },
  'image/webp': { ext: '.webp', magic: [[0x52, 0x49, 0x46, 0x46]] }, // RIFF (….WEBP)
} as const;

type AllowedMime = keyof typeof ALLOWED;

const MAX_BYTES = env.MAX_UPLOAD_MB * 1024 * 1024;

/** In-memory single-file upload; the buffer is sniffed then written by us. */
export const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!(file.mimetype in ALLOWED)) {
      cb(new AppError('UPLOAD_REJECTED', 'Only PDF, JPG, PNG or WebP files are allowed.'));
      return;
    }
    cb(null, true);
  },
}).single('file');

function matchesMagic(buf: Buffer, mime: AllowedMime): boolean {
  const sigs = ALLOWED[mime].magic;
  return sigs.some((sig) => sig.every((byte, i) => buf[i] === byte));
}

export interface StoredFile {
  fileKey: string;
  originalName: string;
  mimeType: AllowedMime;
  sizeBytes: number;
}

/**
 * Validate the buffer's real type by magic bytes (not the client-supplied
 * header) and write it under UPLOAD_DIR with a random key. Rejects mismatches.
 */
export async function storeUpload(file: Express.Multer.File): Promise<StoredFile> {
  const mime = file.mimetype as AllowedMime;
  if (!(mime in ALLOWED)) {
    throw new AppError('UPLOAD_REJECTED', 'Unsupported file type.');
  }
  if (file.size > MAX_BYTES) {
    throw new AppError('UPLOAD_REJECTED', `File is larger than ${env.MAX_UPLOAD_MB} MB.`);
  }
  if (!matchesMagic(file.buffer, mime)) {
    throw new AppError('UPLOAD_REJECTED', 'The file content does not match its type.');
  }

  const dir = path.resolve(env.UPLOAD_DIR);
  await mkdir(dir, { recursive: true });

  const fileKey = `${nanoid(20)}${ALLOWED[mime].ext}`;
  await writeFile(path.join(dir, fileKey), file.buffer, { flag: 'wx' });

  return {
    fileKey,
    originalName: sanitiseName(file.originalname),
    mimeType: mime,
    sizeBytes: file.size,
  };
}

/** Resolve a stored file to a readable stream, guarding against path escape. */
export function openStoredFile(fileKey: string) {
  if (fileKey.includes('/') || fileKey.includes('\\') || fileKey.includes('..')) {
    throw AppError.notFound('File not found.');
  }
  const full = path.join(path.resolve(env.UPLOAD_DIR), fileKey);
  return createReadStream(full);
}

export async function deleteStoredFile(fileKey: string): Promise<void> {
  try {
    await unlink(path.join(path.resolve(env.UPLOAD_DIR), path.basename(fileKey)));
  } catch {
    /* already gone */
  }
}

function sanitiseName(name: string): string {
  return (
    name
      .replace(/[^\w.\- ()]/g, '_')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120) || 'attachment'
  );
}
