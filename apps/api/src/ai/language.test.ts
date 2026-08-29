import { describe, it, expect } from 'vitest';
import { detectLanguage } from './language.js';

describe('detectLanguage', () => {
  it('detects English', () => {
    expect(detectLanguage('Am I eligible for PMFBY crop insurance?')).toBe('en');
  });
  it('detects Tamil', () => {
    expect(detectLanguage('PACS என்றால் என்ன?')).toBe('ta');
  });
  it('detects Hindi', () => {
    expect(detectLanguage('मैं सहकारी सदस्य कैसे बनूँ?')).toBe('hi');
  });
  it('treats code-mixed Tamil+English as Tamil', () => {
    expect(detectLanguage('PMFBY scheme பற்றி சொல்லுங்கள்')).toBe('ta');
  });
  it('falls back for empty input', () => {
    expect(detectLanguage('   ')).toBe('en');
    expect(detectLanguage('', 'hi')).toBe('hi');
  });
});
