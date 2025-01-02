import { OpenAPIHono } from '@hono/zod-openapi';
import { makeGetMyProfileRouteHandler } from './get-my-profile';
import { makeUpdateMyProfileRouteHandler } from './update-my-profile';

const app = new OpenAPIHono();

makeGetMyProfileRouteHandler(app);
makeUpdateMyProfileRouteHandler(app);

export default app;
