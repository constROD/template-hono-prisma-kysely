import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { logger } from 'hono/logger';
import { version } from '../package.json';
import { routes } from './controllers/routes';
import { schemas } from './data/schema';
import { envConfig } from './env';
import { errorHandlerMiddleware } from './middlewares/error-handler';
import { setUpDbClientMiddleware } from './middlewares/set-up-db-client';
import { type HonoEnv } from './types/hono';
import { pinoLogger } from './utils/logger';

const app = new OpenAPIHono<HonoEnv>();

/* API Docs */
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version,
    title: `${envConfig.STAGE.toUpperCase()} API`,
    description: 'API Documentation',
  },
  externalDocs: {
    description: 'API Reference',
    url: '/reference',
  },
});
app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

/* Register Schemas */
Object.entries(schemas).forEach(([key, value]) => {
  app.openAPIRegistry.register(key, value);
});

/* API Docs */
app.get('/swagger', swaggerUI({ url: '/openapi.json' }));
app.get('/reference', apiReference({ spec: { url: '/openapi.json' } }));

/* Global Middlewares */
app.onError(errorHandlerMiddleware);
app.use(logger());
app.use(setUpDbClientMiddleware);

/* Routes */
routes.forEach(route => {
  app.route('/', route);
});

/* Server */
serve({ fetch: app.fetch, port: envConfig.APP_PORT }, info => {
  pinoLogger.info('Listening on port', info.port);
});

export default app;
