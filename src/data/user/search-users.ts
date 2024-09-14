import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';

export type SearchUsersDataArgs = {
  dbClient: DbClient;
  limit?: number;
  page?: number;
  sortBy?: keyof User;
  orderBy?: 'asc' | 'desc';
  includeArchived?: boolean;
  searchText?: string;
};

export async function searchUsersData({
  dbClient,
  limit = 25,
  page = 1,
  sortBy = 'created_at',
  orderBy = 'desc',
  includeArchived,
  searchText,
}: SearchUsersDataArgs) {
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

  if (searchText) {
    query = query.where(eb =>
      eb.or([
        eb('first_name', 'ilike', `%${searchText}%`),
        eb('last_name', 'ilike', `%${searchText}%`),
        eb('email', 'ilike', `%${searchText}%`),
      ])
    );
    allRecordsQuery = allRecordsQuery.where(eb =>
      eb.or([
        eb('first_name', 'ilike', `%${searchText}%`),
        eb('last_name', 'ilike', `%${searchText}%`),
        eb('email', 'ilike', `%${searchText}%`),
      ])
    );
  }

  const records = await query.execute();
  const allRecords = await allRecordsQuery.executeTakeFirst();

  return { records, totalRecords: Number(allRecords?.total_records) ?? 0 };
}
