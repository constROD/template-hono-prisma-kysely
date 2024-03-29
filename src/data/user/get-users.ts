import { type DbClient } from '@/db/create-db-client';

type GetUsersArgs = {
  dbClient: DbClient;
};

export async function getUsers({ dbClient }: GetUsersArgs) {
  const users = await dbClient.selectFrom('users').selectAll().execute();
  return users;
}
