import { OpenAPIHono } from '@hono/zod-openapi';
import { makeGetServerDateTimeRouteHandler } from './get-server-date-time';

const app = new OpenAPIHono();

makeGetServerDateTimeRouteHandler(app);

export default app;
