import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';
import { makeDefaultDataListReturn } from '../make-default-list-return';

export type GetUsersDataArgs = {
  dbClient: DbClient;
  limit?: number;
  page?: number;
  sortBy?: keyof User;
  orderBy?: 'asc' | 'desc';
  includeArchived?: boolean;
};

export async function getUsersData({
  dbClient,
  limit = 25,
  page = 1,
  sortBy = 'created_at',
  orderBy = 'desc',
  includeArchived = false,
}: GetUsersDataArgs) {
  let query = dbClient
    .selectFrom('users')
    .selectAll()
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(sortBy, orderBy);

  let allRecordsQuery = dbClient
    .selectFrom('users')
    .select(eb => eb.fn.count('id').as('total_records'));

  if (!includeArchived) {
    query = query.where('deleted_at', 'is', null);
    allRecordsQuery = allRecordsQuery.where('deleted_at', 'is', null);
  }

  const records = await query.execute();
  const allRecords = await allRecordsQuery.executeTakeFirst();

  return makeDefaultDataListReturn({
    records,
    totalRecords: Number(allRecords?.total_records) ?? 0,
    limit,
    page,
  });
}
