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
    { email: 'TesT@gMail.Com', valid: true },
    { email: '  TesT@gMail.Com  ', valid: false },
    { email: 'TesT@gMail.Com  ', valid: false },
    { email: '', valid: false },
    { email: null, valid: false },
    { email: undefined, valid: false },
  ])(
    'should validate correct email and transform to lowercase: email($email) | valid($valid)',
    ({ email, valid }) => {
      const results = emailSchema.safeParse(email);

      if (results.success) {
        expect(results.success).toBe(valid);
        expect(results.data).toBe(email?.toLowerCase());
      }

      expect(results.success).toBe(valid);
    }
  );
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
