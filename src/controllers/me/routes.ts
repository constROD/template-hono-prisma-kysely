// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { OpenAPIHono } from '@hono/zod-openapi';
import { getMyProfileRoute, getMyProfileRouteHandler } from './get-my-profile';
import { updateMyProfileRoute, updateMyProfileRouteHandler } from './update-my-profile';

const router = new OpenAPIHono()
  .openapi(getMyProfileRoute, getMyProfileRouteHandler)
  .openapi(updateMyProfileRoute, updateMyProfileRouteHandler);

export default router;
