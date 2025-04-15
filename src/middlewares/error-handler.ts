import { type HonoEnv } from '@/types/hono';
import { makeError } from '@/utils/errors';
import { pinoLogger } from '@/utils/logger';
import { type Context } from 'hono';

export async function errorHandlerMiddleware(err: Error, c: Context<HonoEnv>) {
  const { error, statusCode } = makeError(err);
  pinoLogger.error(error.message, error);
  // const errorContextData = {
  //   context: JSON.stringify(c, null, 2),
  //   statusCode: statusCode,
  //   error: error,
  // };
  // sentryClient.captureException(err, { contexts: { data: errorContextData } });
  return c.json(error, { status: statusCode });
}
