import { serve } from '@hono/node-server';
import app from './app';
import { envConfig } from './env';
import { logger } from './utils/logger';

const mainAppEntry = app;

serve({ fetch: mainAppEntry.fetch, port: envConfig.APP_PORT }, info => {
  logger.info('Listening on port', info.port);
});
