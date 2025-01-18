import { type DbClient } from '@/db/create-db-client';
import { type Product, type User } from '@/db/schema';
import { BadRequestError } from '@/utils/errors';
import { makeDefaultDataListReturn } from '../make-default-list-return';
import { userSchemaFields } from '../user/schema';
import { productSchemaFields } from './schema';

export type SearchProductFilters = {
  searchText?: string;
  userId?: string;
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

  if (filters?.searchText) {
    baseQuery = baseQuery.where(eb =>
      eb.or([
        eb('products.name', 'ilike', `%${filters.searchText}%`),
        eb('products.description', 'ilike', `%${filters.searchText}%`),
      ])
    );
  }

  let recordQuery = baseQuery
    .select([
      'products.id',
      'products.created_at',
      'products.updated_at',
      'products.deleted_at',
      'products.name',
      'products.description',
      'products.price',
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

  return makeDefaultDataListReturn({
    records,
    totalRecords: Number(allRecords?.total_records) ?? 0,
    limit,
    page,
  });
}
