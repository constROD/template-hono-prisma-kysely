import { describe, expect, it } from 'vitest';
import { emailSchema, passwordSchema } from './zod-schemas';

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
