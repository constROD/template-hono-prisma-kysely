import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { loginAuthRoute, loginAuthRouteHandler } from './login';
import { logoutAuthRoute, logoutAuthRouteHandler } from './logout';
import { refreshSessionAuthRoute, refreshSessionAuthRouteHandler } from './refresh-session';
import { registerAuthRoute, registerAuthRouteHandler } from './register';

const authRoutes = new OpenAPIHono<HonoEnv>()
  .openapi(loginAuthRoute, loginAuthRouteHandler)
  .openapi(logoutAuthRoute, logoutAuthRouteHandler)
  .openapi(registerAuthRoute, registerAuthRouteHandler)
  .openapi(refreshSessionAuthRoute, refreshSessionAuthRouteHandler);

export default authRoutes;
