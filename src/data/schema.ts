import { productSchemaOpenApi } from './products/schema';
import { userSchemaOpenApi } from './users/schema';

export const schemas = {
  User: userSchemaOpenApi,
  Product: productSchemaOpenApi,
} as const;
