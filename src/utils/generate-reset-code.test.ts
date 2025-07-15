import { describe, expect, it } from 'vitest';
import { generateResetCode } from './generate-reset-code';

describe('generateResetCode', () => {
  it('should generate a 6-character code', () => {
    const code = generateResetCode();
    expect(code).toHaveLength(6);
  });

  it('should only contain allowed characters', () => {
    const allowedCharacters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const code = generateResetCode();
    
    for (const char of code) {
      expect(allowedCharacters).toContain(char);
    }
  });

  it('should generate different codes on multiple calls', () => {
    const codes = new Set<string>();
    
    // Generate 100 codes
    for (let i = 0; i < 100; i++) {
      codes.add(generateResetCode());
    }
    
    // Should have generated at least 95 unique codes (allowing for some collisions)
    expect(codes.size).toBeGreaterThan(95);
  });

  it('should always return uppercase codes', () => {
    const code = generateResetCode();
    expect(code).toBe(code.toUpperCase());
  });
});