import { type StackContext, use } from 'sst/constructs';
import { ApiStack } from './api';

export function MeRoutesStack(context: StackContext) {
  const { apiStack } = use(ApiStack);

  apiStack.addRoutes(context.stack, {
    'GET /me': 'aws/functions/api/me.handler',
    'PUT /me': 'aws/functions/api/me.handler',
  });
}
