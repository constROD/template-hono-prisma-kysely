// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { getServerDateTimeRoute, getServerDateTimeRouteHandler } from './get-server-date-time';

const router = new OpenAPIHono<HonoEnv>().openapi(
  getServerDateTimeRoute,
  getServerDateTimeRouteHandler
);

export default router;
