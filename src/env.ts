import { config } from 'dotenv';
import { z } from 'zod';
import { STAGES } from './constants/env';

config();

export function isTest() {
  return process.env.NODE_ENV === 'test';
}

const envSchema = z.object({
  APP_PORT: z.coerce.number().default(3000),
  STAGE: z.nativeEnum(STAGES).default(STAGES.Dev),
  DB_URL: z.string(),
  TEST_DB_URL: z.string(),
  JWT_ACCESS_TOKEN_SECRET: z.string(),
  JWT_REFRESH_TOKEN_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
});

export const envConfig = envSchema.parse({
  APP_PORT: process.env.APP_PORT,
  STAGE: process.env.STAGE,
  DB_URL: process.env.DB_URL,
  TEST_DB_URL: process.env.TEST_DB_URL,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
});

export type EnvConfig = z.infer<typeof envSchema>;
