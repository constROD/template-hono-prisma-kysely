import { type DbClient } from '@/db/create-db-client';

type DeleteUserArgs = {
  dbClient: DbClient;
  id: string;
};

export async function deleteUser({ dbClient, id }: DeleteUserArgs) {
  const [deletedUser] = await dbClient
    .deleteFrom('users')
    .where('id', '=', id)
    .returningAll()
    .execute();

  return deletedUser;
}
