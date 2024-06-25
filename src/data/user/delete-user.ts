import { type DbClient } from '@/db/create-db-client';
import { getUserData } from './get-user';

export type DeleteUserDataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function deleteUserData({ dbClient, id }: DeleteUserDataArgs) {
  await getUserData({ dbClient, id });

  const deletedRecord = await dbClient
    .deleteFrom('users')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();

  return deletedRecord;
}
