import { type DbClient } from '@/db/create-db-client';

type GetUserArgs = {
  dbClient: DbClient;
  id: string;
};

export async function getUser({ dbClient, id }: GetUserArgs) {
  const [user] = await dbClient.selectFrom('users').where('id', '=', id).selectAll().execute();
  return user;
}
