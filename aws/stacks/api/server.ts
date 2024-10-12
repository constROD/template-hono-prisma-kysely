import { type StackContext, Function } from 'sst/constructs';

export function ServerRoutesStack(context: StackContext) {
  const serverRoutesFn = new Function(context.stack, 'ServerRoutes', {
    handler: 'aws/functions/api/server.handler',
  });

  return { serverRoutesFn };
}
