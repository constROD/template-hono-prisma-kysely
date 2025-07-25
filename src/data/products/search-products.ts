import type { DbClient } from '@/db/create-db-client';
import type { Product, User } from '@/db/schema';
import { BadRequestError } from '@/utils/errors';
import { transformToPaginatedResponse } from '../transform-to-paginated-response';
import { userSchemaFields } from '../users/schema';
import { productSchemaFields } from './schema';

export type SearchProductFilters = {
  q?: string;
  userId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
};

export type SearchProductsDataArgs = {
  dbClient: DbClient;
  limit?: number;
  page?: number;
  sortBy?: keyof Product;
  sortByUserField?: keyof User;
  orderBy?: 'asc' | 'desc';
  includeArchived?: boolean;
  filters?: SearchProductFilters;
};

export async function searchProductsData({
  dbClient,
  limit = 25,
  page = 1,
  sortBy = 'created_at',
  sortByUserField,
  orderBy = 'desc',
  includeArchived = false,
  filters,
}: SearchProductsDataArgs) {
  let baseQuery = dbClient.selectFrom('products').leftJoin('users', 'products.user_id', 'users.id');

  if (!includeArchived) {
    baseQuery = baseQuery.where('products.deleted_at', 'is', null);
  }

  if (filters?.q) {
    baseQuery = baseQuery.where(eb =>
      eb.or([
        eb('products.name', 'ilike', `%${filters.q}%`),
        eb('products.description', 'ilike', `%${filters.q}%`),
      ])
    );
  }

  if (filters?.userId) {
    baseQuery = baseQuery.where('products.user_id', '=', filters.userId);
  }

  if (filters?.startDate) {
    baseQuery = baseQuery.where('products.created_at', '>=', new Date(filters.startDate));
  }
  if (filters?.endDate) {
    baseQuery = baseQuery.where('products.created_at', '<=', new Date(filters.endDate));
  }

  let recordQuery = baseQuery
    .selectAll('products')
    .select([
      /* users */
      'users.id as user_id',
      'users.created_at as user_created_at',
      'users.updated_at as user_updated_at',
      'users.deleted_at as user_deleted_at',
      'users.first_name as user_first_name',
      'users.last_name as user_last_name',
      'users.email as user_email',
      'users.role as user_role',
    ])
    .groupBy(['products.id', 'users.id'])
    .limit(limit)
    .offset((page - 1) * limit);

  /* Sorting */
  if (sortBy && !productSchemaFields.safeParse(sortBy).success) {
    throw new BadRequestError('Invalid sort field for products');
  }
  if (sortByUserField && !userSchemaFields.safeParse(sortByUserField).success) {
    throw new BadRequestError('Invalid sort field for users');
  }

  if (!sortBy && !sortByUserField) {
    recordQuery = recordQuery.orderBy('products.created_at', orderBy);
  }
  if (sortBy) {
    recordQuery = recordQuery.orderBy(`products.${sortBy}`, orderBy);
  }
  if (sortByUserField) {
    recordQuery = recordQuery.orderBy(`users.${sortByUserField}`, orderBy);
  }

  const records = await recordQuery.execute();
  const allRecords = await baseQuery
    .select(eb => eb.fn.count('products.id').as('total_records'))
    .executeTakeFirst();

  return transformToPaginatedResponse({
    records,
    totalRecords: Number(allRecords?.total_records) ?? 0,
    limit,
    page,
  });
}

export type SearchProductsDataResponse = Awaited<ReturnType<typeof searchProductsData>>;
