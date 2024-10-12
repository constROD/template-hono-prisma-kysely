import { envConfig } from '@/env';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { handle } from 'hono/aws-lambda';
import { setupAllRoutesDefinitions } from './routes-definitions';

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
app.openAPIRegistry.registerComponent('securitySchemes', 'AuthToken', {
  type: 'apiKey',
  name: 'x-id-token',
  in: 'header',
});
app.get('/swagger', swaggerUI({ url: '/openapi.json' }));
app.get('/reference', apiReference({ spec: { url: '/openapi.json' } }));

setupAllRoutesDefinitions(app);

export const handler = handle(app);
