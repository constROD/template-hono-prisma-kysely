import { serve } from '@hono/node-server';
import app from './app';
import { envConfig } from './env';

const mainAppEntry = app;

serve({ fetch: mainAppEntry.fetch, port: envConfig.APP_PORT }, info => {
  // eslint-disable-next-line no-console
  console.info('Listening on port', info.port);
});
