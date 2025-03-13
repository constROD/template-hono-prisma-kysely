import { type DbClient } from '@/db/create-db-client';
import { type Product } from '@/db/schema';
import { faker } from '@faker-js/faker';

export function makeFakeProduct(overrides?: Partial<Product>) {
  return {
    id: faker.string.uuid(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    deleted_at: null,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.number.int({ min: 1, max: 100 }),
    user_id: faker.string.uuid(),
    ...overrides,
  } satisfies Product;
}

export type CreateTestProductsInDBArgs = {
  dbClient: DbClient;
  values?: Partial<Product> | Partial<Product>[];
};

export async function createTestProductsInDB({ dbClient, values }: CreateTestProductsInDBArgs) {
  const fakeProducts =
    values instanceof Array ? values.map(makeFakeProduct) : makeFakeProduct(values);
  const createdProducts = await dbClient
    .insertInto('products')
    .values(fakeProducts)
    .returningAll()
    .execute();
  return createdProducts;
}
