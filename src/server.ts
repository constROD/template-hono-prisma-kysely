import { serve } from '@hono/node-server';
import app from './app';
import { getEnvConfig } from './env';
import { pinoLogger } from './utils/logger';

const env = getEnvConfig();
const mainAppEntry = app;

serve({ fetch: mainAppEntry.fetch, port: env.APP_PORT }, info => {
  pinoLogger.info('Listening on port', info.port);
});
