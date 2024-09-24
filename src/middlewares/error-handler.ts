import { makeError } from '@/utils/errors';
import { pinoLogger } from '@/utils/logger';
import { type Context } from 'hono';

export async function errorHandlerMiddleware(err: Error, c: Context) {
  const { error, statusCode } = makeError(err);
  pinoLogger.error(error.message, error);
  return c.json(error, { status: statusCode });
}
