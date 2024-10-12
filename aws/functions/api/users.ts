import { authenticationMiddleware } from '@/middlewares/authentication';
import { errorHandlerMiddleware } from '@/middlewares/error-handler';
import { setUpDbClientMiddleware } from '@/middlewares/set-up-db-client';
import { OpenAPIHono } from '@hono/zod-openapi';
import { handle } from 'hono/aws-lambda';
import { setupUsersRoutes } from './routes-definitions';

const app = new OpenAPIHono();

app.onError(errorHandlerMiddleware);
app.use(setUpDbClientMiddleware);
app.use(authenticationMiddleware);

setupUsersRoutes(app);

export const handler = handle(app);
