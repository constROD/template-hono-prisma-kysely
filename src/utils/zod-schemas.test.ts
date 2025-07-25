import { describe, expect, it } from 'vitest';
import {
  decimalNumberSchema,
  emailSchema,
  listQuerySchema,
  paginationSchema,
  passwordSchema,
} from './zod-schemas';

describe('emailSchema', () => {
  it.each([
    { email: 'test@gmail.com', valid: true, reason: 'Gmail address without dots' },
    { email: 'test@example.com', valid: true, reason: 'Non-Gmail address' },
    { email: 'TesT@example.Com', valid: true, reason: 'Valid email with mixed case' },
    { email: '  TesT@example.Com  ', valid: true, reason: 'Valid email with spaces' },
    { email: 'test+123@gmail.com', valid: false, reason: 'Plus addressing' },
    { email: 'test+tag@example.com', valid: false, reason: 'Plus addressing on non-Gmail' },
    { email: 'te.st@gmail.com', valid: true, reason: 'Gmail with dots' },
    { email: 't.e.s.t@gmail.com', valid: true, reason: 'Gmail with multiple dots' },
    { email: 'test@googlemail.com', valid: true, reason: 'Googlemail domain without dots' },
    { email: 'test.name@googlemail.com', valid: true, reason: 'Googlemail with dots' },
    { email: 'test.name@example.com', valid: true, reason: 'Non-Gmail with dots allowed' },
    { email: '.test@example.com', valid: false, reason: 'Dot at start' },
    { email: 'test.@example.com', valid: false, reason: 'Dot at end' },
    { email: 'test..name@example.com', valid: false, reason: 'Consecutive dots' },
    { email: '', valid: false, reason: 'Empty string' },
    { email: null, valid: false, reason: 'Null value' },
    { email: undefined, valid: false, reason: 'Undefined value' },
  ])('should validate email: $reason - email($email) | valid($valid)', ({ email, valid }) => {
    const results = emailSchema.safeParse(email);

    if (results.success) {
      expect(results.success).toBe(valid);
      expect(results.data).toBe(email?.trim().toLowerCase());
    }

    expect(results.success).toBe(valid);
  });
});

describe('passwordSchema', () => {
  it.each([
    { password: 'Password1!', valid: true },
    { password: 'password1!', valid: false },
    { password: 'Password!', valid: false },
    { password: 'Password1', valid: false },
    {
      password: 'Password1!Password1!Password1!Password1!Password1!Password1!Password1!Password1!',
      valid: false,
    },
    { password: '', valid: false },
    { password: null, valid: false },
    { password: undefined, valid: false },
  ])(
    'should validate correct password: password($password) | valid($valid)',
    ({ password, valid }) => {
      const results = passwordSchema.safeParse(password);

      if (results.success) {
        expect(results.success).toBe(valid);
        expect(results.data).toBe(password);
      }

      expect(results.success).toBe(valid);
    }
  );
});

describe('decimalNumberSchema', () => {
  it.each([
    { value: '10.00', valid: true },
    { value: '10', valid: true },
    { value: '10.00.00', valid: false },
    { value: '10.00.00.00', valid: false },
    { value: '', valid: false },
    { value: null, valid: false },
    { value: undefined, valid: false },
  ])(
    'should validate correct decimal number: value($value) | valid($valid)',
    ({ value, valid }) => {
      const results = decimalNumberSchema.safeParse(value);

      if (results.success) {
        expect(results.success).toBe(valid);
        expect(results.data).toBe(value);
      }

      expect(results.success).toBe(valid);
    }
  );
});

describe('paginationSchema', () => {
  it('should validate pagination data', () => {
    const paginationData = {
      total_records: 100,
      total_pages: 10,
      current_page: 1,
      next_page: 2,
      previous_page: null,
    };

    const results = paginationSchema.safeParse(paginationData);

    expect(results.success).toBe(true);
    expect(results.data).toEqual(paginationData);
  });

  it('should return error for invalid pagination data', () => {
    const paginationData = {
      total_records: 100,
      total_pages: true,
      current_page: 1,
      next_page: '123',
      previous_page: 'asd',
    };

    const results = paginationSchema.safeParse(paginationData);

    expect(results.success).toBe(false);
    expect(results.error).toBeDefined();
  });
});

describe('listQuerySchema', () => {
  it('should validate list query data', () => {
    const listQueryData = {
      limit: 10,
      page: 1,
      order_by: 'desc',
      include_archived: 'false',
    };

    const results = listQuerySchema.safeParse(listQueryData);

    expect(results.success).toBe(true);
    expect(results.data).toEqual(listQueryData);
  });

  it('should return error for invalid list query data', () => {
    const listQueryData = {
      limit: 10,
      page: 1,
      order_by: 'desc',
      include_archived: false, // Invalid string boolean
    };

    const results = listQuerySchema.safeParse(listQueryData);

    expect(results.success).toBe(false);
    expect(results.error).toBeDefined();
  });
});
