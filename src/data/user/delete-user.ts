import { type DbClient } from '@/db/create-db-client';

type DeleteUserDataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function deleteUserData({ dbClient, id }: DeleteUserDataArgs) {
  const [deletedUser] = await dbClient
    .deleteFrom('users')
    .where('id', '=', id)
    .returningAll()
    .execute();

  return deletedUser;
}
