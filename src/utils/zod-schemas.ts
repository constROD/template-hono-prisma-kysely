import { z } from 'zod';
import { isValidStringDecimalNumber } from './number';

export const emailSchema = z.string().email('Please enter a valid email address.').toLowerCase();

const passwordValidationMessages = [
  'Password must be at least 8 characters long',
  'Password must have 1 lowercase',
  'Password must have 1 uppercase ',
  'Password must have 1 special character, and 1 number.',
  'Password should not exceed 16 characters',
];

export const passwordSchema = z.string().refine(value => {
  const minLength = value.length >= 8;
  const hasLowercase = /[a-z]/.test(value);
  const hasUppercase = /[A-Z]/.test(value);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
  const hasNumber = /\d/.test(value);
  const maxLength = value.length <= 16;

  return minLength && hasLowercase && hasUppercase && hasSpecialChar && hasNumber && maxLength;
}, passwordValidationMessages.join('\n'));

export const decimalNumberSchema = z
  .string()
  .min(1)
  .refine(value => isValidStringDecimalNumber(value), {
    message: 'Value is not a valid decimal number',
  });

export const paginationSchema = z.object({
  total_pages: z.number(),
  current_page: z.number(),
  next_page: z.number().nullable(),
  previous_page: z.number().nullable(),
});

export const listQuerySchema = z.object({
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  order_by: z.enum(['asc', 'desc']).optional(),
  include_archived: z.enum(['true', 'false']).optional(),
});
