import { type DbClient } from '@/db/create-db-client';
import { type KyselyTables } from '@/db/schema';
import { type UpdateObject } from 'kysely';

type UpdateUserArgs = {
  dbClient: DbClient;
  id: string;
  values: UpdateObject<KyselyTables, 'users'>;
};

export async function updateUser({ dbClient, id, values }: UpdateUserArgs) {
  const [updatedUser] = await dbClient
    .updateTable('users')
    .set(values)
    .where('id', '=', id)
    .returningAll()
    .execute();

  return updatedUser;
}
