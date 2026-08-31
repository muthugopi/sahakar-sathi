import { describe, it, expect } from 'vitest';
import { classifyQuestion } from './classify.js';

describe('classifyQuestion', () => {
  it('routes eligibility questions to official-only', () => {
    const c = classifyQuestion('What documents are required to apply for PMFBY?');
    expect(c.route).toBe('official');
    expect(c.sensitive).toBe(true);
  });

  it('routes "am I eligible" to official-only', () => {
    expect(classifyQuestion('Am I eligible for the Kisan Credit Card?').route).toBe('official');
  });

  it('routes definitions to hybrid', () => {
    const c = classifyQuestion('What is a cooperative society?');
    expect(c.route).toBe('hybrid');
    expect(c.sensitive).toBe(false);
  });

  it('routes "latest update" to current', () => {
    expect(classifyQuestion('What is the latest PMFBY update?').route).toBe('current');
  });

  it('a year reference counts as current', () => {
    expect(classifyQuestion('PMFBY guidelines 2026').route).toBe('current');
  });

  it('a current-info eligibility question stays sensitive but routes to current', () => {
    const c = classifyQuestion('What are the new eligibility rules for PMFBY this year?');
    expect(c.route).toBe('current');
    expect(c.sensitive).toBe(true);
  });

  it('handles Hindi definitional questions', () => {
    expect(classifyQuestion('सहकारी समिति क्या है?').route).toBe('hybrid');
  });

  it('handles Tamil eligibility questions', () => {
    expect(classifyQuestion('PMFBY-க்கு தேவையான ஆவணங்கள் என்ன?').sensitive).toBe(true);
  });
});
