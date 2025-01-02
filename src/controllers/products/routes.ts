import { OpenAPIHono } from '@hono/zod-openapi';
import { makeGetProductsRouteHandler } from './get-products';

const app = new OpenAPIHono();

makeGetProductsRouteHandler(app);

export default app;
