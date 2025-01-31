import { type StackContext, use } from 'sst/constructs';
import { ApiStack } from './api';

export function ApiDocumentationRoutesStack(context: StackContext) {
  const { apiStack } = use(ApiStack);

  const handler = 'aws/functions/api/api-documentation.handler';

  apiStack.addRoutes(context.stack, {
    'GET /swagger': { function: { handler } },
    'GET /reference': { function: { handler } },
    'GET /openapi.json': { function: { handler } },
  });
}
