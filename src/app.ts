import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { version } from '../package.json';
import { STAGES } from './constants/env';
import { routes } from './controllers/routes';
import { schemas } from './data/schema';
import { getEnvConfig } from './env';
import { errorHandlerMiddleware } from './middlewares/error-handler';
import { setUpDbClientMiddleware } from './middlewares/set-up-db-client';
import type { HonoEnv } from './types/hono';

const app = new OpenAPIHono<HonoEnv>();

const env = getEnvConfig();

if (env.STAGE !== STAGES.Prod) {
  /* API Docs */
  app.doc('/openapi.json', {
    openapi: '3.0.0',
    info: {
      version,
      title: `${env.STAGE.toUpperCase()} API`,
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
}

const ALLOWED_ORIGINS = ['https://yourdomain.com', 'https://www.yourdomain.com'];

if (env.STAGE !== STAGES.Prod) {
  ALLOWED_ORIGINS.push('http://localhost:3000');
  ALLOWED_ORIGINS.push('http://localhost:5173');
}

/* Global Middlewares */
app.onError(errorHandlerMiddleware);
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(logger());
app.use(setUpDbClientMiddleware);

/* Routes */
routes.forEach(route => {
  app.route('/', route);
});

export default app;
