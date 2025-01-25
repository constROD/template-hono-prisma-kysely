import { productSchemaOpenApi } from './product/schema';
import { userSchemaOpenApi } from './user/schema';

export const schemas = {
  User: userSchemaOpenApi,
  Product: productSchemaOpenApi,
} as const;
