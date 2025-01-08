import { errorHandlerMiddleware } from '@/middlewares/error-handler';
import { setUpDbClientMiddleware } from '@/middlewares/set-up-db-client';
import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { handle } from 'hono/aws-lambda';
import productsRoutes from 'src/controllers/products/routes';

const app = new OpenAPIHono<HonoEnv>();

app.onError(errorHandlerMiddleware);
app.use(setUpDbClientMiddleware);
app.route('/', productsRoutes);

export const handler = handle(app);
