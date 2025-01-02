import { envConfig } from '@/env';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { handle } from 'hono/aws-lambda';
import meRoutes from 'src/controllers/me/routes';
import productsRoutes from 'src/controllers/products/routes';
import serverRoutes from 'src/controllers/server/routes';
import usersRoutes from 'src/controllers/users/routes';

const app = new OpenAPIHono();

/* API Docs */
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '2.0.0',
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

const routes = [serverRoutes, meRoutes, usersRoutes, productsRoutes];

routes.forEach(route => {
  app.route('/', route);
});

export const handler = handle(app);
