import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { logger } from 'hono/logger';
import { version } from '../package.json';
import { getMyProfileHandler, getMyProfileRoute } from './controllers/me/get-my-profile';
import { updateMyProfileHandler, updateMyProfileRoute } from './controllers/me/update-my-profile';
import { getProductsHandler, getProductsRoute } from './controllers/products/get-products';
import { archiveUserHandler, archiveUserRoute } from './controllers/users/archive-user';
import { createUserHandler, createUserRoute } from './controllers/users/create-user';
import { deleteUserHandler, deleteUserRoute } from './controllers/users/delete-user';
import { getUserHandler, getUserRoute } from './controllers/users/get-user';
import { getUsersHandler, getUsersRoute } from './controllers/users/get-users';
import { updateUserHandler, updateUserRoute } from './controllers/users/update-user';
import { type createDbClient } from './db/create-db-client';
import { envConfig } from './env';
import { authenticationMiddleware } from './middlewares/authentication';
import { errorHandlerMiddleware } from './middlewares/error-handler';
import { setUpDbClientMiddleware } from './middlewares/set-up-db-client';
import { type AuthenticatedUser, type Session } from './types/auth';

const app = new OpenAPIHono();

declare module 'hono' {
  interface ContextVariableMap {
    session: Session | null;
    authenticatedUser: AuthenticatedUser | null;
    dbClient: ReturnType<typeof createDbClient>;
  }
}

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
/* Users */
app.openapi(getUsersRoute, getUsersHandler);
app.openapi(createUserRoute, createUserHandler);
app.openapi(getUserRoute, getUserHandler);
app.openapi(updateUserRoute, updateUserHandler);
app.openapi(deleteUserRoute, deleteUserHandler);
app.openapi(archiveUserRoute, archiveUserHandler);

/* Products */
app.openapi(getProductsRoute, getProductsHandler);
/* ===== Public Routes ===== */

/**
 * This needs to be declared before the private routes
 * so that the routes `BELOW` will be protected by this middleware
 */
app.use(authenticationMiddleware);

/* ===== Private Routes ===== */
/* Me */
app.openapi(getMyProfileRoute, getMyProfileHandler);
app.openapi(updateMyProfileRoute, updateMyProfileHandler);
/* ===== Private Routes ===== */

/* Serve */
serve({
  fetch: app.fetch,
  port: envConfig.APP_PORT,
});

// eslint-disable-next-line no-console
console.info(`Listening on port: ${envConfig.APP_PORT}`);
