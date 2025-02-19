import { type DbClient } from '@/db/create-db-client';
import { type Product } from '@/db/schema';
import { overrideValueOrUseDefault } from '@/utils/guard';
import { faker } from '@faker-js/faker';

export function makeFakeProduct(args?: Partial<Product>) {
  return {
    id: overrideValueOrUseDefault(args?.id, faker.string.uuid()),
    created_at: overrideValueOrUseDefault(args?.created_at, faker.date.recent()),
    updated_at: overrideValueOrUseDefault(args?.updated_at, faker.date.recent()),
    deleted_at: overrideValueOrUseDefault(args?.deleted_at, null),
    name: overrideValueOrUseDefault(args?.name, faker.commerce.productName()),
    description: overrideValueOrUseDefault(args?.description, faker.commerce.productDescription()),
    price: overrideValueOrUseDefault(args?.price, faker.number.int({ min: 1, max: 100 })),
    user_id: overrideValueOrUseDefault(args?.user_id, faker.string.uuid()),
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
