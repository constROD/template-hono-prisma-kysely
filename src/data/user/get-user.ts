import { type DbClient } from '@/db/create-db-client';
import { ValidationError } from '@/utils/errors';

export type GetUserDataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function getUserData({ dbClient, id }: GetUserDataArgs) {
  const record = await dbClient
    .selectFrom('users')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow(() => new ValidationError('User not found.'));

  return record;
}
