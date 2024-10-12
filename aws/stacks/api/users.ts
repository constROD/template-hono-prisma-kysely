import { type StackContext, Function } from 'sst/constructs';

export function UsersRoutesStack(context: StackContext) {
  const usersRoutesFn = new Function(context.stack, 'UsersRoutes', {
    handler: 'aws/functions/api/users.handler',
  });

  return { usersRoutesFn };
}
