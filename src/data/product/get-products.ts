import { type DbClient } from '@/db/create-db-client';
import { type Product } from '@/db/schema';

export type GetProductsDataArgs = {
  dbClient: DbClient;
  limit?: number;
  page?: number;
  sortBy?: keyof Product;
  orderBy?: 'asc' | 'desc';
};

export async function getProductsData({
  dbClient,
  limit = 25,
  page = 1,
  sortBy = 'created_at',
  orderBy = 'desc',
}: GetProductsDataArgs) {
  const records = await dbClient
    .selectFrom('products')
    .selectAll()
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(sortBy, orderBy)
    .execute();

  const allRecords = await dbClient
    .selectFrom('products')
    .select(dbClient.fn.count('id').as('total_records'))
    .executeTakeFirst();

  return { records, totalRecords: Number(allRecords?.total_records) ?? 0 };
}
