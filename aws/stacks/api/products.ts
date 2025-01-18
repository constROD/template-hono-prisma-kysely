import { type StackContext, use } from 'sst/constructs';
import { ApiStack } from './api';

export function ProductsRoutesStack(context: StackContext) {
  const { apiStack } = use(ApiStack);

  apiStack.addRoutes(context.stack, {
    'GET /products/search': 'aws/functions/api/products.handler',
    'GET /products': 'aws/functions/api/products.handler',
  });
}
