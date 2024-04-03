import { type DbClient } from '@/db/create-db-client';
import { type KyselySchema } from '@/db/schema';
import { type UpdateObject } from 'kysely';

type UpdateUserArgs = {
  dbClient: DbClient;
  id: string;
  values: UpdateObject<KyselySchema, 'users'>;
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
