import { type StackContext, use } from 'sst/constructs';
import { ApiStack } from './api';

export function UsersRoutesStack(context: StackContext) {
  const { apiStack } = use(ApiStack);

  const handler = 'aws/functions/api/users.handler';

  apiStack.addRoutes(context.stack, {
    'GET /users/search': { function: { handler } },
    'GET /users': { function: { handler } },
    'POST /users': { function: { handler } },
    'GET /users/{user_id}': { function: { handler } },
    'PUT /users/{user_id}': { function: { handler } },
    'DELETE /users/{user_id}': { function: { handler } },
    'DELETE /users/{user_id}/archive': { function: { handler } },
  });
}
