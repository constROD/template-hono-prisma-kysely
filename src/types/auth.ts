import { type JWTPayload } from '@/lib/jwt';

export type Session = {
  email: string;
  accountId: string;
  sessionId: string;
  accessToken: string;
  refreshToken: string;
};

export type AccessTokenJWTPayload = JWTPayload<{
  email: string;
  accountId: string;
  sessionId: string;
}>;

export type RefreshTokenJWTPayload = JWTPayload<{
  accountId: string;
}>;
