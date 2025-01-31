import { type StackContext, use } from 'sst/constructs';
import { ApiStack } from './api';

export function MeRoutesStack(context: StackContext) {
  const { apiStack } = use(ApiStack);

  const handler = 'aws/functions/api/me.handler';

  apiStack.addRoutes(context.stack, {
    'GET /me': { function: { handler } },
    'PUT /me': { function: { handler } },
  });
}
