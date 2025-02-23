import { featureFlagSchemaOpenApi } from './feature-flags/schema';
import { productSchemaOpenApi } from './products/schema';
import { userSchemaOpenApi } from './users/schema';

export const schemas = {
  FeatureFlag: featureFlagSchemaOpenApi,
  User: userSchemaOpenApi,
  Product: productSchemaOpenApi,
} as const;
