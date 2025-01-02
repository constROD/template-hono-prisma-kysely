import { errorHandlerMiddleware } from '@/middlewares/error-handler';
import { setUpDbClientMiddleware } from '@/middlewares/set-up-db-client';
import { OpenAPIHono } from '@hono/zod-openapi';
import { makeGetServerDateTimeRouteHandler } from './get-server-date-time';

const app = new OpenAPIHono();

app.onError(errorHandlerMiddleware);
app.use(setUpDbClientMiddleware);

makeGetServerDateTimeRouteHandler(app);

export default app;
