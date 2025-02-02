import { envConfig } from '@/env';
import jwt from 'jsonwebtoken';

export type GenerateAccessTokenArgs = {
  payload: {
    email: string;
    accountId: string;
    sessionId: string;
  };
  options?: { expiresIn?: string; issuer?: 'login' | 'refresh'; audience?: 'frontend' | 'backend' };
};

export function generateAccessToken({ payload, options }: GenerateAccessTokenArgs) {
  return jwt.sign(
    {
      email: payload.email,
      accountId: payload.accountId,
      sessionId: payload.sessionId,
      // For Security
      sub: payload.email,
      iss: options?.issuer,
      aud: options?.audience,
    },
    envConfig.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: options?.expiresIn || '1d' }
  );
}

export type GenerateRefreshTokenArgs = {
  payload: { accountId: string };
  options?: { expiresIn?: string };
};

export function generateRefreshToken({ payload, options }: GenerateRefreshTokenArgs) {
  return jwt.sign(payload, envConfig.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: options?.expiresIn || '30d',
  });
}

export function verifyAccessToken(token: string): GenerateAccessTokenArgs['payload'] | null {
  return jwt.verify(token, envConfig.JWT_ACCESS_TOKEN_SECRET) as
    | GenerateAccessTokenArgs['payload']
    | null;
}

export function verifyRefreshToken(token: string): GenerateRefreshTokenArgs['payload'] | null {
  return jwt.verify(token, envConfig.JWT_REFRESH_TOKEN_SECRET) as
    | GenerateRefreshTokenArgs['payload']
    | null;
}
