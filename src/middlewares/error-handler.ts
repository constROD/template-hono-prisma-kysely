import { type HonoEnv } from '@/types/hono';
import { makeError } from '@/utils/errors';
import { type Context } from 'hono';

export async function errorHandlerMiddleware(err: Error, c: Context<HonoEnv>) {
  const { error, statusCode } = makeError(err);
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
