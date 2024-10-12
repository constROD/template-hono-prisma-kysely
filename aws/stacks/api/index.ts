import { Api, type StackContext } from 'sst/constructs';
import { ApiDocumentationRoutesStack } from './api-documentation';
import { MeRoutesStack } from './me';
import { ProductsRoutesStack } from './products';
import { ServerRoutesStack } from './server';
import { UsersRoutesStack } from './users';

export function API(context: StackContext) {
  const { apiDocumentationRoutesFn } = ApiDocumentationRoutesStack(context);
  const { serverRoutesFn } = ServerRoutesStack(context);
  const { meRoutesFn } = MeRoutesStack(context);
  const { usersRoutesFn } = UsersRoutesStack(context);
  const { productsRoutesFn } = ProductsRoutesStack(context);

  const api = new Api(context.stack, 'Api', {
    routes: {
      /* API Documentation */
      'GET /swagger': apiDocumentationRoutesFn,
      'GET /reference': apiDocumentationRoutesFn,
      'GET /openapi.json': apiDocumentationRoutesFn,

      /* Server */
      'GET /server/date-time': serverRoutesFn,

      /* Me */
      'GET /me': meRoutesFn,

      /* Users */
      'GET /users/search': usersRoutesFn,
      'GET /users': usersRoutesFn,
      'POST /users': usersRoutesFn,
      'GET /users/{user_id}': usersRoutesFn,
      'PUT /users/{user_id}': usersRoutesFn,
      'DELETE /users/{user_id}': usersRoutesFn,
      'DELETE /users/{user_id}/archive': usersRoutesFn,

      /* Products */
      'GET /products': productsRoutesFn,
    },
  });

  context.stack.addOutputs({ API: api.url });

  return api;
}
