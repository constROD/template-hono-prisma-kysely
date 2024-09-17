import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';

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
  includeArchived,
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

  if (!includeArchived) {
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

  return {
    records,
    totalRecords: Number(allRecords?.total_records) ?? 0,
    totalPages: Math.ceil(Number(allRecords?.total_records) / limit),
    currentPage: page,
    nextPage: page < Math.ceil(Number(allRecords?.total_records) / limit) ? page + 1 : null,
    previousPage: page > 1 ? page - 1 : null,
  };
}
