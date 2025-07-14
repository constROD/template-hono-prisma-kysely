import { STAGES, type Stage } from '@/constants/env';

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
  path: string;
  maxAge: number;
}

export function getAccessTokenCookieOptions(stage: Stage): CookieOptions {
  const isProduction = stage === STAGES.Prod;

  return {
    httpOnly: true,
    // CRITICAL: For any non-production environment, disable secure flag
    // This allows HTTP localhost frontends to receive cookies from HTTPS APIs
    secure: isProduction,
    sameSite: isProduction ? 'Strict' : 'Lax', // Allow cross-origin in dev/staging
    path: '/',
    maxAge: 60 * 60 * 24 * 1, // 1 day (in seconds)
  };
}

export function getRefreshTokenCookieOptions(stage: Stage): CookieOptions {
  const isProduction = stage === STAGES.Prod;

  return {
    httpOnly: true,
    // CRITICAL: For any non-production environment, disable secure flag
    // This allows HTTP localhost frontends to receive cookies from HTTPS APIs
    secure: isProduction,
    sameSite: isProduction ? 'Strict' : 'Lax', // Allow cross-origin in dev/staging
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days (in seconds)
  };
}

export interface DeleteCookieOptions {
  path: string;
  secure: boolean;
  httpOnly: boolean;
}

export function getDeleteCookieOptions(stage: Stage): DeleteCookieOptions {
  const isProduction = stage === STAGES.Prod;

  return {
    path: '/',
    secure: isProduction, // Only enable secure in production
    httpOnly: true,
  };
}
