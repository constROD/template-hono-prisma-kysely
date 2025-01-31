import { type StackContext, use } from 'sst/constructs';
import { ApiStack } from './api';

export function ServerRoutesStack(context: StackContext) {
  const { apiStack } = use(ApiStack);

  const handler = 'aws/functions/api/server.handler';

  apiStack.addRoutes(context.stack, {
    'GET /server/date-time': { function: { handler } },
  });
}
