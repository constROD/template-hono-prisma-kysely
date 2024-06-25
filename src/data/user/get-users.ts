import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';

export type GetUsersDataArgs = {
  dbClient: DbClient;
  limit?: number;
  page?: number;
  sortBy?: keyof User;
  orderBy?: 'asc' | 'desc';
};

/*
  * For query that is based on user_id field. This is useful when you want to get records that are specific to a user.

  export async function getBills({
    dbClient,
    limit = 25,
    page = 1,
    sortBy = 'created_at',
    orderBy = 'desc',
    userId,
  }: GetBillsDataArgs) {
    let query = dbClient
      .selectFrom('bills')
      .selectAll()
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(sortBy, orderBy);

    let allRecordsQuery = dbClient
      .selectFrom('bills')
      .select(dbClient.fn.count('id').as('total_records'));

    if (userId) {
      query = query.where('user_id', '=', userId);
      allRecordsQuery = allRecordsQuery.where('user_id', '=', userId);
    }

    const records = await query.execute();
    const allRecords = await allRecordsQuery.executeTakeFirst();

    return { records, totalRecords: Number(allRecords?.total_records) ?? 0 };
  }
*/

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
