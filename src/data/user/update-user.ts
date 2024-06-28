import { type DbClient } from '@/db/create-db-client';
import { sql } from 'kysely';
import { getUserData } from './get-user';
import { type UpdateUser } from './schema';

export type UpdateUserDataArgs = {
  dbClient: DbClient;
  id: string;
  values: UpdateUser;
};

export async function updateUserData({ dbClient, id, values }: UpdateUserDataArgs) {
  await getUserData({ dbClient, id });

  const updatedRecord = await dbClient
    .updateTable('users')
    .set({ ...values, updated_at: sql`NOW()` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow();

  return updatedRecord;
}
