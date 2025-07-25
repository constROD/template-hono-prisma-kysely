import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { logger } from 'hono/logger';
import { version } from '../package.json';
import { STAGES } from './constants/env';
import { routes } from './controllers/routes';
import { schemas } from './data/schema';
import { envConfig } from './env';
import { errorHandlerMiddleware } from './middlewares/error-handler';
import { setUpDbClientMiddleware } from './middlewares/set-up-db-client';
import type { HonoEnv } from './types/hono';

const app = new OpenAPIHono<HonoEnv>();

if (envConfig.STAGE !== STAGES.Prod) {
  /* API Docs */
  app.get('/openapi.json', c => {
    const doc = app.getOpenAPIDocument({
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

    return c.json(doc);
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

/* Global Middlewares */
app.onError(errorHandlerMiddleware);
app.use(logger());
app.use(setUpDbClientMiddleware);

/* Routes */
routes.forEach(route => {
  app.route('/', route);
});

export default app;
