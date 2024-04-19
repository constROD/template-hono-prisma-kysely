import { type DbClient } from '@/db/create-db-client';

type GetUsersDataArgs = {
  dbClient: DbClient;
};

export async function getUsersData({ dbClient }: GetUsersDataArgs) {
  const users = await dbClient.selectFrom('users').selectAll().execute();
  return users;
}
