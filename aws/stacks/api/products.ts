import { type StackContext, Function } from 'sst/constructs';

export function ProductsRoutesStack(context: StackContext) {
  const productsRoutesFn = new Function(context.stack, 'ProductsRoutes', {
    handler: 'aws/functions/api/products.handler',
  });

  return { productsRoutesFn };
}
