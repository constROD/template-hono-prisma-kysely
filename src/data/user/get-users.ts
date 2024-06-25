import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';

export type GetUsersDataArgs = {
  dbClient: DbClient;
  limit?: number;
  page?: number;
  sortBy?: keyof User;
  orderBy?: 'asc' | 'desc';
};

export async function getUsersData({
  dbClient,
  limit = 25,
  page = 1,
  sortBy = 'created_at',
  orderBy = 'desc',
}: GetUsersDataArgs) {
  const records = await dbClient
    .selectFrom('users')
    .selectAll()
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(sortBy, orderBy)
    .execute();

  const allRecords = await dbClient
    .selectFrom('users')
    .select(dbClient.fn.count('id').as('total_records'))
    .executeTakeFirst();

  return { records, totalRecords: Number(allRecords?.total_records) ?? 0 };
}
