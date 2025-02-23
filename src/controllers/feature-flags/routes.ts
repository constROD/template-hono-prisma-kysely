import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { getFeatureFlagRoute, getFeatureFlagRouteHandler } from './get-feature-flag';

const featureFlagRoutes = new OpenAPIHono<HonoEnv>().openapi(
  getFeatureFlagRoute,
  getFeatureFlagRouteHandler
);

export default featureFlagRoutes;
