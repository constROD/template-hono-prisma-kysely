import { envConfig } from '@/env';
import jwt, { type JwtPayload } from 'jsonwebtoken';

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
    { expiresIn: options?.expiresIn || '5m' }
  );
}

export type GenerateRefreshTokenArgs = {
  payload: { accountId: string; email: string };
  options?: { expiresIn?: string };
};

export function generateRefreshToken({ payload, options }: GenerateRefreshTokenArgs) {
  return jwt.sign(payload, envConfig.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: options?.expiresIn || '1h',
  });
}

export type VerifyAccessTokenResponse = GenerateAccessTokenArgs['payload'] & JwtPayload;

export function verifyAccessToken(token: string): VerifyAccessTokenResponse | null {
  return jwt.verify(token, envConfig.JWT_ACCESS_TOKEN_SECRET) as VerifyAccessTokenResponse | null;
}

export type VerifyRefreshTokenResponse = GenerateRefreshTokenArgs['payload'] & JwtPayload;

export function verifyRefreshToken(token: string): VerifyRefreshTokenResponse | null {
  return jwt.verify(token, envConfig.JWT_REFRESH_TOKEN_SECRET) as VerifyRefreshTokenResponse | null;
}
