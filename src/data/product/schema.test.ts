import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { productSchema, type Product } from './schema';

describe('productSchema', () => {
  it('should validate productSchema', () => {
    const input: Product = {
      id: faker.string.uuid(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: Number(faker.commerce.price()),
    };

    const result = productSchema.safeParse(input);

    expect(result.success).toBe(true);
  });
});
