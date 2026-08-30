import { extractText, getDocumentProxy } from 'unpdf';
import { AppError } from './AppError.js';

/**
 * Extract plain text from a PDF buffer for knowledge ingestion.
 * unpdf bundles a serverless pdf.js build — no native deps.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    const cleaned = text
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (cleaned.length < 40) {
      throw new AppError(
        'UPLOAD_REJECTED',
        'No readable text was found in that PDF. Scanned image PDFs are not supported yet — paste the text instead.',
      );
    }
    return cleaned;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('UPLOAD_REJECTED', 'That PDF could not be read.');
  }
}
