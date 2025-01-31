import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { getServerDateTimeRoute, getServerDateTimeRouteHandler } from './get-server-date-time';

const serverRoutes = new OpenAPIHono<HonoEnv>().openapi(
  getServerDateTimeRoute,
  getServerDateTimeRouteHandler
);

export default serverRoutes;
