import type { DbClient } from '@/db/create-db-client';
import type { User } from '@/db/schema';
import { transformToPaginatedResponse } from '../transform-to-paginated-response';

export type SearchUsersFilters = {
  q?: string;
};

export type SearchUsersDataArgs = {
  dbClient: DbClient;
  limit?: number;
  page?: number;
  sortBy?: keyof User;
  orderBy?: 'asc' | 'desc';
  includeArchived?: boolean;
  filters?: SearchUsersFilters;
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

  if (filters?.q) {
    baseQuery = baseQuery.where(eb =>
      eb.or([
        eb('first_name', 'ilike', `%${filters.q}%`),
        eb('last_name', 'ilike', `%${filters.q}%`),
        eb('email', 'ilike', `%${filters.q}%`),
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

  return transformToPaginatedResponse({
    records,
    totalRecords: Number(allRecords?.total_records) ?? 0,
    limit,
    page,
  });
}

export type SearchUsersDataResponse = Awaited<ReturnType<typeof searchUsersData>>;
