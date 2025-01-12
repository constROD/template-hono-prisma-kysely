// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck NOTE: Remove this when you are changing something in this file and put it back once you are done
import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { getMyProfileRoute, getMyProfileRouteHandler } from './get-my-profile';
import { updateMyProfileRoute, updateMyProfileRouteHandler } from './update-my-profile';

const meRoutes = new OpenAPIHono<HonoEnv>()
  .openapi(getMyProfileRoute, getMyProfileRouteHandler)
  .openapi(updateMyProfileRoute, updateMyProfileRouteHandler);

export default meRoutes;
