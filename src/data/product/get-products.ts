import { type DbClient } from '@/db/create-db-client';

type GetProductsDataArgs = {
  dbClient: DbClient;
};

export async function getProductsData({ dbClient }: GetProductsDataArgs) {
  const records = await dbClient.selectFrom('products').selectAll().execute();
  return records;
}
