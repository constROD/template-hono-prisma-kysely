import { describe, expect, it } from 'vitest';
import { decimal } from './decimal';

describe('decimal utility', () => {
  describe('add', () => {
    it.each([
      { a: '10.00', b: '5.00', expected: '15.00' },
      { a: '0.10', b: '0.20', expected: '0.30' },
      { a: '0.01', b: '0.02', expected: '0.03' },
      { a: '1.99', b: '0.02', expected: '2.01' },
      { a: '-5.00', b: '10.00', expected: '5.00' },
      { a: '0.00', b: '0.00', expected: '0.00' },
      // Test for rounding
      { a: '0.001', b: '0.002', expected: '0.00' },
      { a: '0.005', b: '0.001', expected: '0.01' },
    ])('should add $a and $b to equal $expected', ({ a, b, expected }) => {
      expect(decimal.add(a, b)).toBe(expected);
    });
  });

  describe('subtract', () => {
    it.each([
      { a: '10.00', b: '5.00', expected: '5.00' },
      { a: '0.30', b: '0.10', expected: '0.20' },
      { a: '2.00', b: '1.50', expected: '0.50' },
      { a: '1.00', b: '2.00', expected: '-1.00' },
      { a: '0.00', b: '0.00', expected: '0.00' },
      // Test for rounding
      { a: '0.005', b: '0.001', expected: '0.01' },
      { a: '0.015', b: '0.001', expected: '0.02' },
    ])('should subtract $b from $a to equal $expected', ({ a, b, expected }) => {
      expect(decimal.subtract(a, b)).toBe(expected);
    });
  });

  describe('multiply', () => {
    it.each([
      { a: '10.00', b: '5.00', expected: '50.00' },
      { a: '0.10', b: '0.10', expected: '0.01' },
      { a: '2.50', b: '2.00', expected: '5.00' },
      { a: '0.00', b: '5.00', expected: '0.00' },
      { a: '-2.00', b: '3.00', expected: '-6.00' },
      { a: '-2.00', b: '-3.00', expected: '6.00' },
      { a: '1.23', b: '4.56', expected: '5.61' }, // 5.6088 rounded to 2 decimal places
    ])('should multiply $a by $b to equal $expected', ({ a, b, expected }) => {
      expect(decimal.multiply(a, b)).toBe(expected);
    });
  });

  describe('divide', () => {
    it.each([
      { a: '10.00', b: '2.00', expected: '5.00' },
      { a: '5.00', b: '2.00', expected: '2.50' },
      { a: '0.50', b: '0.25', expected: '2.00' },
      { a: '0.00', b: '5.00', expected: '0.00' },
      { a: '-6.00', b: '2.00', expected: '-3.00' },
      { a: '-6.00', b: '-2.00', expected: '3.00' },
      { a: '1.00', b: '3.00', expected: '0.33' }, // 0.3333... rounded to 2 decimal places
    ])('should divide $a by $b to equal $expected', ({ a, b, expected }) => {
      expect(decimal.divide(a, b)).toBe(expected);
    });

    it('should handle division by zero', () => {
      expect(decimal.divide('5.00', '0.00')).toBe('Infinity');
    });
  });

  describe('calculatePercentage', () => {
    it.each([
      { value: '50.00', total: '100.00', expected: '50.00' },
      { value: '25.00', total: '100.00', expected: '25.00' },
      { value: '75.00', total: '150.00', expected: '50.00' },
      { value: '10.00', total: '40.00', expected: '25.00' },
      { value: '150.00', total: '100.00', expected: '150.00' },
      { value: '0.00', total: '100.00', expected: '0.00' },
      { value: '1.50', total: '50.00', expected: '3.00' },
    ])(
      'should calculate $value as percentage of $total to equal $expected%',
      ({ value, total, expected }) => {
        expect(decimal.calculatePercentage({ value, total })).toBe(expected);
      }
    );
  });

  describe('getValueFromPercentage', () => {
    it.each([
      { percentage: '50.00', total: '100.00', expected: '50.00' },
      { percentage: '25.00', total: '100.00', expected: '25.00' },
      { percentage: '10.00', total: '500.00', expected: '50.00' },
      { percentage: '75.00', total: '200.00', expected: '150.00' },
      { percentage: '5.00', total: '60.00', expected: '3.00' },
      { percentage: '0.00', total: '100.00', expected: '0.00' },
      { percentage: '100.00', total: '100.00', expected: '100.00' },
    ])('should get $expected from $percentage% of $total', ({ percentage, total, expected }) => {
      expect(decimal.getValueFromPercentage({ percentage, total })).toBe(expected);
    });
  });

  describe('addPercent', () => {
    it.each([
      { value: '100.00', percentage: '10.00', expected: '110.00' },
      { value: '50.00', percentage: '5.00', expected: '52.50' },
      { value: '200.00', percentage: '25.00', expected: '250.00' },
      { value: '80.00', percentage: '100.00', expected: '160.00' },
      { value: '0.00', percentage: '50.00', expected: '0.00' },
      { value: '100.00', percentage: '0.00', expected: '100.00' },
    ])(
      'should add $percentage% to $value to equal $expected',
      ({ value, percentage, expected }) => {
        expect(decimal.addPercent({ value, percentage })).toBe(expected);
      }
    );
  });

  describe('subtractPercent', () => {
    it.each([
      { value: '100.00', percentage: '10.00', expected: '90.00' },
      { value: '50.00', percentage: '5.00', expected: '47.50' },
      { value: '200.00', percentage: '25.00', expected: '150.00' },
      { value: '80.00', percentage: '100.00', expected: '0.00' },
      { value: '0.00', percentage: '50.00', expected: '0.00' },
      { value: '100.00', percentage: '0.00', expected: '100.00' },
    ])(
      'should subtract $percentage% from $value to equal $expected',
      ({ value, percentage, expected }) => {
        expect(decimal.subtractPercent({ value, percentage })).toBe(expected);
      }
    );
  });
});
