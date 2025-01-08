import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { logger } from 'hono/logger';
import { version } from '../package.json';
import meRoutes from './controllers/me/routes';
import productsRoutes from './controllers/products/routes';
import serverRoutes from './controllers/server/routes';
import usersRoutes from './controllers/users/routes';
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
app.get('/swagger', swaggerUI({ url: '/openapi.json' }));
app.get('/reference', apiReference({ spec: { url: '/openapi.json' } }));

/* Global Middlewares */
app.onError(errorHandlerMiddleware);
app.use(logger());
app.use(setUpDbClientMiddleware);

/* Routes */
const routes = [serverRoutes, meRoutes, usersRoutes, productsRoutes] as const;

routes.forEach(route => {
  app.route('/', route);
});

/* Serve */
serve({
  fetch: app.fetch,
  port: envConfig.APP_PORT,
});

pinoLogger.info('Listening on port', envConfig.APP_PORT);

export type AppType = (typeof routes)[number];

export default app;
