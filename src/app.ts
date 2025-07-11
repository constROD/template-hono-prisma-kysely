import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { version } from '../package.json';
import { STAGES } from './constants/env';
import { routes } from './controllers/routes';
import { schemas } from './data/schema';
import { errorHandlerMiddleware } from './middlewares/error-handler';
import { setUpDbClientMiddleware } from './middlewares/set-up-db-client';
import type { HonoEnv } from './types/hono';
import { ForbiddenError } from './utils/errors';

const app = new OpenAPIHono<HonoEnv>();

/* API Docs */
app.get('/openapi.json', c => {
  if (c.env.STAGE === STAGES.Prod) throw new ForbiddenError('Not allowed');

  const doc = app.getOpenAPIDocument({
    openapi: '3.0.0',
    info: {
      version,
      title: `${c.env.STAGE.toUpperCase()} API`,
      description: 'API Documentation',
    },
    externalDocs: {
      description: 'API Reference',
      url: '/reference',
    },
  });

  return c.json(doc);
});
app.get(
  '/swagger',
  (c, next) => {
    if (c.env.STAGE === STAGES.Prod) throw new ForbiddenError('Not allowed');
    return next();
  },
  swaggerUI({ url: '/openapi.json' })
);
app.get(
  '/reference',
  (c, next) => {
    if (c.env.STAGE === STAGES.Prod) throw new ForbiddenError('Not allowed');
    return next();
  },
  apiReference({ spec: { url: '/openapi.json' } })
);
app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});
Object.entries(schemas).forEach(([key, value]) => {
  app.openAPIRegistry.register(key, value);
});

/* Global Middlewares */
app.onError(errorHandlerMiddleware);
app.use('*', (c, next) => {
  const ALLOWED_ORIGINS = ['https://yourdomain.com', 'https://www.yourdomain.com'];

  if (c.env.STAGE !== STAGES.Prod) {
    ALLOWED_ORIGINS.push('http://localhost:3000');
    ALLOWED_ORIGINS.push('http://localhost:5173');
  }

  const corsMiddlewareHandler = cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  return corsMiddlewareHandler(c, next);
});
app.use(logger());
app.use(setUpDbClientMiddleware);

/* Routes */
routes.forEach(route => {
  app.route('/', route);
});

export default app;
