import { describe, it, expect } from 'vitest';
import { parseCitations, scoreConfidence } from './chat.service.js';
import { chunkText } from './knowledge.service.js';
import type { RetrievedChunk } from './retrieval.service.js';

const chunk = (score: number): RetrievedChunk => ({
  chunkId: 'x',
  documentId: 'd' + score,
  title: 't',
  authority: 'a',
  category: 'PACS_SERVICE',
  sourceUrl: null,
  verifiedAt: null,
  content: 'c',
  score,
});

describe('parseCitations', () => {
  it('pulls single and grouped markers', () => {
    expect(parseCitations('See [1] and also [2, 3].')).toEqual([1, 2, 3]);
  });
  it('returns empty when nothing is cited', () => {
    expect(parseCitations('No citations here.')).toEqual([]);
  });
  it('dedupes', () => {
    expect(parseCitations('[1] ... [1] ... [2]')).toEqual([1, 2]);
  });
});

describe('scoreConfidence', () => {
  it('NO_SOURCE when nothing retrieved', () => {
    expect(scoreConfidence([], [])).toBe('NO_SOURCE');
  });
  it('HIGH on a strong top match that was used', () => {
    expect(scoreConfidence([chunk(0.9)], [chunk(0.9)])).toBe('HIGH');
  });
  it('MEDIUM on a moderate match', () => {
    expect(scoreConfidence([chunk(0.8)], [chunk(0.8)])).toBe('MEDIUM');
  });
  it('LOW on a weak match', () => {
    expect(scoreConfidence([chunk(0.74)], [])).toBe('LOW');
  });
});

describe('chunkText', () => {
  it('keeps short docs as one chunk', () => {
    expect(chunkText('One short paragraph.')).toHaveLength(1);
  });
  it('splits on blank lines and respects target size', () => {
    const para = 'x'.repeat(900);
    const chunks = chunkText(`${para}\n\n${para}\n\n${para}`);
    expect(chunks.length).toBeGreaterThanOrEqual(3);
    for (const c of chunks) expect(c.length).toBeLessThanOrEqual(1600);
  });
  it('hard-splits a very long paragraph', () => {
    const huge = ('This is a sentence. '.repeat(200)).trim();
    const chunks = chunkText(huge);
    expect(chunks.length).toBeGreaterThan(1);
  });
});
