import { type StackContext, Function } from 'sst/constructs';

export function MeRoutesStack(context: StackContext) {
  const meRoutesFn = new Function(context.stack, 'MeRoutes', {
    handler: 'aws/functions/api/me.handler',
  });

  return { meRoutesFn };
}
