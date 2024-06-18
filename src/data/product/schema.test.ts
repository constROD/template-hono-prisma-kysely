import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { productSchema, type Product } from './schema';

describe('productSchema', () => {
  it('should validate Product schema', () => {
    const input: Product = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: Number(faker.commerce.price()),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    const result = productSchema.safeParse(input);

    expect(result.success).toBe(true);
  });
});
