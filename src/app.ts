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
import { envConfig } from './env';
import { makeError } from './utils/errors';

const app = new OpenAPIHono();

/* Swagger Docs */
app.doc('/swagger.json', {
  openapi: '3.0.0',
  info: {
    version,
    title: `${envConfig.STAGE.toUpperCase()} API`,
  },
});
app.get('/', swaggerUI({ url: '/swagger.json' }));

/* Error Handler */
app.onError((err, c) => {
  const { error, statusCode } = makeError(err);
  return c.json(error, { status: statusCode });
});

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
