import { type DbClient } from '@/db/create-db-client';

type GetProductsArgs = {
  dbClient: DbClient;
};

export async function getProducts({ dbClient }: GetProductsArgs) {
  const products = await dbClient.selectFrom('products').selectAll().execute();
  return products;
}
