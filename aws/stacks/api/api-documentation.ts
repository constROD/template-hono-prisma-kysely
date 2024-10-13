import { type StackContext, use } from 'sst/constructs';
import { ApiStack } from './api';

export function ApiDocumentationRoutesStack(context: StackContext) {
  const { apiStack } = use(ApiStack);

  apiStack.addRoutes(context.stack, {
    'GET /swagger': 'aws/functions/api/api-documentation.handler',
    'GET /reference': 'aws/functions/api/api-documentation.handler',
    'GET /openapi.json': 'aws/functions/api/api-documentation.handler',
  });
}
