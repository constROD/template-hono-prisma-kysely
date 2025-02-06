import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { changePasswordAuthRoute, changePasswordAuthRouteHandler } from './change-password';
import { loginAuthRoute, loginAuthRouteHandler } from './login';
import { logoutAuthRoute, logoutAuthRouteHandler } from './logout';
import { registerAuthRoute, registerAuthRouteHandler } from './register';
import { tokenAuthRoute, tokenAuthRouteHandler } from './token';

const authRoutes = new OpenAPIHono<HonoEnv>()
  .openapi(registerAuthRoute, registerAuthRouteHandler)
  .openapi(loginAuthRoute, loginAuthRouteHandler)
  .openapi(tokenAuthRoute, tokenAuthRouteHandler)
  .openapi(changePasswordAuthRoute, changePasswordAuthRouteHandler)
  .openapi(logoutAuthRoute, logoutAuthRouteHandler);

export default authRoutes;
