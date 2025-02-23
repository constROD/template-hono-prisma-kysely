import { featureFlagSchemaOpenApi } from '@/data/feature-flags/schema';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { getFeatureFlagService } from '@/services/feature-flags/get-feature-flag';
import { type Session } from '@/types/auth';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, type z } from '@hono/zod-openapi';

export const getFeatureFlagSchema = {
  response: featureFlagSchemaOpenApi,
};

export type GetFeatureFlagResponse = z.infer<typeof getFeatureFlagSchema.response>;

export const getFeatureFlagRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/feature-flags',
  tags: ['Feature Flags'],
  summary: 'Retrieve the feature flag',
  description: 'Retrieve the feature flag.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getFeatureFlagSchema.response,
        },
      },
      description: 'Feature flag retrieved successfully',
    },
  },
});

export const getFeatureFlagRouteHandler: AppRouteHandler<typeof getFeatureFlagRoute> = async c => {
  const dbClient = c.get('dbClient');
  const session = c.get('session') as Session;

  const featureFlag = await getFeatureFlagService({
    dbClient,
    payload: { session },
  });

  return c.json(featureFlag, { status: 200 });
};
