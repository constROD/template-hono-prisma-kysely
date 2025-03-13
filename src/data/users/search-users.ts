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
  includeArchived?: boolean;
  filters?: SearchUserFilters;
};

export async function searchUsersData({
  dbClient,
  limit = 25,
  page = 1,
  sortBy = 'created_at',
  orderBy = 'desc',
  includeArchived = false,
  filters,
}: SearchUsersDataArgs) {
  let baseQuery = dbClient.selectFrom('users');

  if (!includeArchived) {
    baseQuery = baseQuery.where('deleted_at', 'is', null);
  }

  if (filters?.searchText) {
    baseQuery = baseQuery.where(eb =>
      eb.or([
        eb('first_name', 'ilike', `%${filters.searchText}%`),
        eb('last_name', 'ilike', `%${filters.searchText}%`),
        eb('email', 'ilike', `%${filters.searchText}%`),
      ])
    );
  }

  const records = await baseQuery
    .selectAll()
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(sortBy, orderBy)
    .execute();

  const allRecords = await baseQuery
    .select(eb => eb.fn.count('id').as('total_records'))
    .executeTakeFirst();

  return makeDefaultDataListReturn({
    records,
    totalRecords: Number(allRecords?.total_records) ?? 0,
    limit,
    page,
  });
}
