import jwt, { type SignOptions } from 'jsonwebtoken';

export type JWTPayload<TCustomPayload extends Record<string, unknown>> = TCustomPayload & {
  sub: string;
  iss?: 'login' | 'refresh';
  aud?: 'frontend' | 'backend';
};

export type GenerateJWTArgs<TPayload extends Record<string, unknown>> = {
  payload: JWTPayload<TPayload>;
  secretOrPrivateKey: string;
  signOptions?: SignOptions;
};

export function generateJWT<TPayload extends Record<string, unknown>>({
  payload,
  secretOrPrivateKey,
  signOptions,
}: GenerateJWTArgs<TPayload>) {
  return jwt.sign(payload, secretOrPrivateKey, signOptions);
}

export type VerifyJWTArgs = {
  token: string;
  secretOrPublicKey: string;
};

export function verifyJWT<TPayload extends Record<string, unknown>>({
  token,
  secretOrPublicKey,
}: VerifyJWTArgs) {
  return jwt.verify(token, secretOrPublicKey) as JWTPayload<TPayload> | null;
}

export type DecodeJWTArgs = {
  token: string;
};

export function decodeJWT<TPayload extends Record<string, unknown>>({ token }: DecodeJWTArgs) {
  return jwt.decode(token) as JWTPayload<TPayload> | null;
}
