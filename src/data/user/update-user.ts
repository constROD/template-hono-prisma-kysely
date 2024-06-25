import { type DbClient } from '@/db/create-db-client';
import { type KyselySchema } from '@/db/schema';
import { ValidationError } from '@/utils/errors';
import { sql, type UpdateObject } from 'kysely';
import { getUserData } from './get-user';

export type UpdateUserDataArgs = {
  dbClient: DbClient;
  id: string;
  values: UpdateObject<KyselySchema, 'users'>;
};

export async function updateUserData({ dbClient, id, values }: UpdateUserDataArgs) {
  await getUserData({ dbClient, id });

  if (values.email) throw new ValidationError('Cannot update email.');

  const updatedRecord = await dbClient
    .updateTable('users')
    .set({ ...values, updated_at: sql`NOW()` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow();

  return updatedRecord;
}
