import { type StackContext, use } from 'sst/constructs';
import { ApiStack } from './api';

export function ServerRoutesStack(context: StackContext) {
  const { apiStack } = use(ApiStack);

  apiStack.addRoutes(context.stack, {
    'GET /server/date-time': 'aws/functions/api/server.handler',
  });
}
