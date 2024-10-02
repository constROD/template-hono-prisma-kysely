import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';
import { makeDefaultDataListReturn } from '../make-default-list-return';

export type SearchUserFilters = {
  searchText?: string;
};

export type SearchUsersDataArgs = {
  dbClient: DbClient;
  limit?: number;
  page?: number;
  sortBy?: keyof User;
  orderBy?: 'asc' | 'desc';
  includeArchived?: 'true' | 'false';
  filters?: SearchUserFilters;
};

export async function searchUsersData({
  dbClient,
  limit = 25,
  page = 1,
  sortBy = 'created_at',
  orderBy = 'desc',
  includeArchived = 'false',
  filters,
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

  const shouldIncludeArchived = includeArchived === 'true';
  if (!shouldIncludeArchived) {
    query = query.where('deleted_at', 'is', null);
    allRecordsQuery = allRecordsQuery.where('deleted_at', 'is', null);
  }

  if (filters?.searchText) {
    query = query.where(eb =>
      eb.or([
        eb('first_name', 'ilike', `%${filters.searchText}%`),
        eb('last_name', 'ilike', `%${filters.searchText}%`),
        eb('email', 'ilike', `%${filters.searchText}%`),
      ])
    );
    allRecordsQuery = allRecordsQuery.where(eb =>
      eb.or([
        eb('first_name', 'ilike', `%${filters.searchText}%`),
        eb('last_name', 'ilike', `%${filters.searchText}%`),
        eb('email', 'ilike', `%${filters.searchText}%`),
      ])
    );
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
