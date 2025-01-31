import { type StackContext, use } from 'sst/constructs';
import { ApiStack } from './api';

export function ProductsRoutesStack(context: StackContext) {
  const { apiStack } = use(ApiStack);

  const handler = 'aws/functions/api/products.handler';

  apiStack.addRoutes(context.stack, {
    'GET /products/search': { function: { handler } },
    'GET /products': { function: { handler } },
  });
}
