import { type StackContext, use } from 'sst/constructs';
import { ApiStack } from './api';

export function UsersRoutesStack(context: StackContext) {
  const { apiStack } = use(ApiStack);

  apiStack.addRoutes(context.stack, {
    'GET /users/search': 'aws/functions/api/users.handler',
    'GET /users': 'aws/functions/api/users.handler',
    'POST /users': 'aws/functions/api/users.handler',
    'GET /users/{user_id}': 'aws/functions/api/users.handler',
    'PUT /users/{user_id}': 'aws/functions/api/users.handler',
    'DELETE /users/{user_id}': 'aws/functions/api/users.handler',
    'DELETE /users/{user_id}/archive': 'aws/functions/api/users.handler',
  });
}
