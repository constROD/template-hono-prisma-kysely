import { errorHandlerMiddleware } from '@/middlewares/error-handler';
import { setUpDbClientMiddleware } from '@/middlewares/set-up-db-client';
import { OpenAPIHono } from '@hono/zod-openapi';
import { makeGetProductsRouteHandler } from './get-products';

const app = new OpenAPIHono();

app.onError(errorHandlerMiddleware);
app.use(setUpDbClientMiddleware);

makeGetProductsRouteHandler(app);

export default app;
