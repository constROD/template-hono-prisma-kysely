import { describe, expect, it } from 'vitest';
import { isValidStringDecimalNumber } from './number';

describe('isValidStringDecimalNumber', () => {
  it.each([
    { value: '10.00', expected: true },
    { value: '10', expected: true },
    { value: '10.00.00', expected: false },
    { value: '10.00.00.00', expected: false },
  ])('should return $expected for $value', ({ value, expected }) => {
    expect(isValidStringDecimalNumber(value)).toBe(expected);
  });
});
