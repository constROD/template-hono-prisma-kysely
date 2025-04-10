import { type DbClient } from '@/db/create-db-client';
import { NotFoundError } from '@/utils/errors';
import { sql } from 'kysely';
import { type UpdateUser } from './schema';

export type UpdateUserDataArgs = {
  dbClient: DbClient;
  id: string;
  values: UpdateUser;
};

export async function updateUserData({ dbClient, id, values }: UpdateUserDataArgs) {
  const updatedRecord = await dbClient
    .updateTable('users')
    .set({ ...values, updated_at: sql`NOW()` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('User not found.'));

  return updatedRecord;
}

export type UpdateUserDataResponse = Awaited<ReturnType<typeof updateUserData>>;
