import { type StackContext, Function } from 'sst/constructs';

export function ApiDocumentationRoutesStack(context: StackContext) {
  const apiDocumentationRoutesFn = new Function(context.stack, 'ApiDocumentationRoutes', {
    handler: 'aws/functions/api/api-documentation.handler',
  });

  return { apiDocumentationRoutesFn };
}
