// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { OpenAPIHono } from '@hono/zod-openapi';
import { getProductsRoute, getProductsRouteHandler } from './get-products';

const router = new OpenAPIHono().openapi(getProductsRoute, getProductsRouteHandler);

export default router;
