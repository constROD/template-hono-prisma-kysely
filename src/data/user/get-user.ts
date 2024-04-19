import { type DbClient } from '@/db/create-db-client';

type GetUserDataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function getUserData({ dbClient, id }: GetUserDataArgs) {
  const [user] = await dbClient.selectFrom('users').where('id', '=', id).selectAll().execute();
  return user;
}
