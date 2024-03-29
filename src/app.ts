import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { version } from '../package.json';
import { createUserHandler, createUserRoute } from './api/users/create-user';
import { deleteUserHandler, deleteUserRoute } from './api/users/delete-user';
import { getUserHandler, getUserRoute } from './api/users/get-user';
import { getUsersHandler, getUsersRoute } from './api/users/get-users';
import { updateUserHandler, updateUserRoute } from './api/users/update-user';
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
  if (error.name === 'ZodError') return c.json(error, { status: statusCode });
  return c.text(error.message, { status: statusCode });
});

/* Routes */
app.openapi(getUsersRoute, getUsersHandler);
app.openapi(createUserRoute, createUserHandler);
app.openapi(getUserRoute, getUserHandler);
app.openapi(updateUserRoute, updateUserHandler);
app.openapi(deleteUserRoute, deleteUserHandler);

/* Serve */
serve({
  fetch: app.fetch,
  port: envConfig.APP_PORT,
});

// eslint-disable-next-line no-console
console.info(`Listening on port: ${envConfig.APP_PORT}`);
