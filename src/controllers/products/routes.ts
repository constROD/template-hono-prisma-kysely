// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { getProductsRoute, getProductsRouteHandler } from './get-products';

const productsRoutes = new OpenAPIHono<HonoEnv>().openapi(
  getProductsRoute,
  getProductsRouteHandler
);

export default productsRoutes;
