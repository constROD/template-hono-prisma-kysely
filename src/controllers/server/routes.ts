// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck NOTE: Remove this when you are changing something in this file and put it back once you are done
import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { getServerDateTimeRoute, getServerDateTimeRouteHandler } from './get-server-date-time';

const serverRoutes = new OpenAPIHono<HonoEnv>().openapi(
  getServerDateTimeRoute,
  getServerDateTimeRouteHandler
);

export default serverRoutes;
