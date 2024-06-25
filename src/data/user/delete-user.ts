import { type DbClient } from '@/db/create-db-client';

export type DeleteUserDataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function deleteUserData({ dbClient, id }: DeleteUserDataArgs) {
  const [deletedRecord] = await dbClient
    .deleteFrom('users')
    .where('id', '=', id)
    .returningAll()
    .execute();

  return deletedRecord;
}
