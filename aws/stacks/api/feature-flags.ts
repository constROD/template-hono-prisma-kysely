import { type StackContext, use } from 'sst/constructs';
import { ApiStack } from './api';

export function FeatureFlagsStack(context: StackContext) {
  const { apiStack } = use(ApiStack);

  const handler = 'aws/functions/api/feature-flags.handler';

  apiStack.addRoutes(context.stack, {
    'GET /feature-flags': { function: { handler } },
  });
}
