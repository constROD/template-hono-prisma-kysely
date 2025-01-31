import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { getMyProfileRoute, getMyProfileRouteHandler } from './get-my-profile';
import { updateMyProfileRoute, updateMyProfileRouteHandler } from './update-my-profile';

const meRoutes = new OpenAPIHono<HonoEnv>()
  .openapi(getMyProfileRoute, getMyProfileRouteHandler)
  .openapi(updateMyProfileRoute, updateMyProfileRouteHandler);

export default meRoutes;
