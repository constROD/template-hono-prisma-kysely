import { type DbClient } from '@/db/create-db-client';
import { NotFoundError } from '@/utils/errors';

export type GetUserDataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function getUserData({ dbClient, id }: GetUserDataArgs) {
  const record = await dbClient
    .selectFrom('users')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('User not found.'));

  return record;
}

export type GetUserDataResponse = Awaited<ReturnType<typeof getUserData>>;
