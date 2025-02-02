import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { loginAuthRoute, loginAuthRouteHandler } from './login';
import { registerAuthRoute, registerAuthRouteHandler } from './register';
import { verifySessionAuthRoute, verifySessionAuthRouteHandler } from './verify-session';

const authRoutes = new OpenAPIHono<HonoEnv>()
  .openapi(loginAuthRoute, loginAuthRouteHandler)
  .openapi(registerAuthRoute, registerAuthRouteHandler)
  .openapi(verifySessionAuthRoute, verifySessionAuthRouteHandler);

export default authRoutes;
