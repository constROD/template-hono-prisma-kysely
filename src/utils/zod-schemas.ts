import { z } from 'zod';

export const emailSchema = z
  .string()
  .email('Please enter a valid email address.')
  .trim()
  .toLowerCase();

const passwordValidationMessages = [
  'Password must be at least 8 characters long',
  'Password must have 1 lowercase',
  'Password must have 1 uppercase ',
  'Password must have 1 special character, and 1 number.',
];

export const passwordSchema = z.string().refine(value => {
  const minLength = value.length >= 8;
  const hasLowercase = /[a-z]/.test(value);
  const hasUppercase = /[A-Z]/.test(value);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
  const hasNumber = /\d/.test(value);

  return minLength && hasLowercase && hasUppercase && hasSpecialChar && hasNumber;
}, passwordValidationMessages.join('\n'));
