import { type DbClient } from '@/db/create-db-client';
import { type Product } from '@/db/schema';

export type GetProductsDataArgs = {
  dbClient: DbClient;
  limit?: number;
  page?: number;
  sortBy?: keyof Product;
  orderBy?: 'asc' | 'desc';
  includeArchived?: boolean;
};

export async function getProductsData({
  dbClient,
  limit = 25,
  page = 1,
  sortBy = 'created_at',
  orderBy = 'desc',
  includeArchived,
}: GetProductsDataArgs) {
  let query = dbClient
    .selectFrom('products')
    .selectAll()
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(sortBy, orderBy);

  let allRecordsQuery = dbClient
    .selectFrom('products')
    .select(eb => eb.fn.count('id').as('total_records'));

  if (!includeArchived) {
    query = query.where('deleted_at', 'is', null);
    allRecordsQuery = allRecordsQuery.where('deleted_at', 'is', null);
  }

  const records = await query.execute();
  const allRecords = await allRecordsQuery.executeTakeFirst();

  return { records, totalRecords: Number(allRecords?.total_records) ?? 0 };
}
