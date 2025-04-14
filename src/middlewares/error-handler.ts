import { makeError } from '@/utils/errors';
import { pinoLogger } from '@/utils/logger';
import { type Context } from 'hono';

export async function errorHandlerMiddleware(err: Error, c: Context) {
  const { error, statusCode } = makeError(err);
  pinoLogger.error(error.message, error);
  // const errorContextData = {
  //   request: {
  //     params: JSON.stringify(c.req.param(), null, 2),
  //     query: JSON.stringify(c.req.query(), null, 2),
  //     headers: JSON.stringify(c.req.header(), null, 2),
  //     body: JSON.stringify(await c.req.json(), null, 2),
  //   },
  //   statusCode: statusCode,
  //   error: error,
  // };
  // sentryClient.captureException(err, { contexts: { data: errorContextData } });
  return c.json(error, { status: statusCode });
}
