import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { logger } from 'hono/logger';
import { version } from '../package.json';
import { makeGetServerDateTimeRouteHandler } from './controllers/get-server-date-time';
import { makeGetMyProfileRouteHandler } from './controllers/me/get-my-profile';
import { makeUpdateMyProfileRouteHandler } from './controllers/me/update-my-profile';
import { makeGetProductsRouteHandler } from './controllers/products/get-products';
import { makeArchiveUserRouteHandler } from './controllers/users/archive-user';
import { makeCreateUserRouteHandler } from './controllers/users/create-user';
import { makeDeleteUserRouteHandler } from './controllers/users/delete-user';
import { makeGetUserRouteHandler } from './controllers/users/get-user';
import { makeGetUsersRouteHandler } from './controllers/users/get-users';
import { makeSearchUsersRouteHandler } from './controllers/users/search-users';
import { makeUpdateUserRouteHandler } from './controllers/users/update-user';
import { type DbClient } from './db/create-db-client';
import { envConfig } from './env';
import { authenticationMiddleware } from './middlewares/authentication';
import { errorHandlerMiddleware } from './middlewares/error-handler';
import { setUpDbClientMiddleware } from './middlewares/set-up-db-client';
import { type AuthenticatedUser, type Session } from './types/auth';
import { pinoLogger } from './utils/logger';

declare module 'hono' {
  interface ContextVariableMap {
    session: Session | null;
    authenticatedUser: AuthenticatedUser | null;
    dbClient: DbClient;
  }
}

const app = new OpenAPIHono();

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
app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
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

/* ===== Public Routes ===== */
makeGetServerDateTimeRouteHandler(app);

/* Users */
makeSearchUsersRouteHandler(app);
makeGetUsersRouteHandler(app);
makeCreateUserRouteHandler(app);
makeGetUserRouteHandler(app);
makeUpdateUserRouteHandler(app);
makeDeleteUserRouteHandler(app);
makeArchiveUserRouteHandler(app);

/* Products */
makeGetProductsRouteHandler(app);
/* ===== Public Routes ===== */

/**
 * This needs to be declared before the private routes
 * so that the routes `BELOW` will be protected by this middleware
 */
app.use(authenticationMiddleware);

/* ===== Private Routes ===== */
/* Me */
makeGetMyProfileRouteHandler(app);
makeUpdateMyProfileRouteHandler(app);
/* ===== Private Routes ===== */

/* Serve */
serve({
  fetch: app.fetch,
  port: envConfig.APP_PORT,
});

// eslint-disable-next-line no-console
pinoLogger.info('Listening on port', envConfig.APP_PORT);
