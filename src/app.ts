import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { version } from '../package.json';
import { getProductsHandler, getProductsRoute } from './controllers/products/get-products';
import { createUserHandler, createUserRoute } from './controllers/users/create-user';
import { deleteUserHandler, deleteUserRoute } from './controllers/users/delete-user';
import { getUserHandler, getUserRoute } from './controllers/users/get-user';
import { getUsersHandler, getUsersRoute } from './controllers/users/get-users';
import { updateUserHandler, updateUserRoute } from './controllers/users/update-user';
import { type createDbClient } from './db/create-db-client';
import { envConfig } from './env';

import { logger } from 'hono/logger';
import { errorHandlerMiddleware } from './middlewares/error-handler';
import { setUpDbClientMiddleware } from './middlewares/set-up-db-client';

const app = new OpenAPIHono();

declare module 'hono' {
  interface ContextVariableMap {
    dbClient: ReturnType<typeof createDbClient>;
  }
}

/* Swagger Docs */
app.doc('/swagger.json', {
  openapi: '3.0.0',
  info: {
    version,
    title: `${envConfig.STAGE.toUpperCase()} API`,
  },
});
app.get('/', swaggerUI({ url: '/swagger.json' }));

/* Middlewares */
app.onError(errorHandlerMiddleware);
app.use(logger());
app.use(setUpDbClientMiddleware);

/* Routes */
app.openapi(getUsersRoute, getUsersHandler);
app.openapi(createUserRoute, createUserHandler);
app.openapi(getUserRoute, getUserHandler);
app.openapi(updateUserRoute, updateUserHandler);
app.openapi(deleteUserRoute, deleteUserHandler);

app.openapi(getProductsRoute, getProductsHandler);

/* Serve */
serve({
  fetch: app.fetch,
  port: envConfig.APP_PORT,
});

// eslint-disable-next-line no-console
console.info(`Listening on port: ${envConfig.APP_PORT}`);
