import { errorHandlerMiddleware } from '@/middlewares/error-handler';
import { setUpDbClientMiddleware } from '@/middlewares/set-up-db-client';
import { OpenAPIHono } from '@hono/zod-openapi';
import { makeGetMyProfileRouteHandler } from './get-my-profile';
import { makeUpdateMyProfileRouteHandler } from './update-my-profile';

const app = new OpenAPIHono();

app.onError(errorHandlerMiddleware);
app.use(setUpDbClientMiddleware);

makeGetMyProfileRouteHandler(app);
makeUpdateMyProfileRouteHandler(app);

export default app;
