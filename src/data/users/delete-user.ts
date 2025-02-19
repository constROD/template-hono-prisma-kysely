import { type DbClient } from '@/db/create-db-client';
import { NotFoundError } from '@/utils/errors';

export type DeleteUserDataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function deleteUserData({ dbClient, id }: DeleteUserDataArgs) {
  const deletedRecord = await dbClient
    .deleteFrom('users')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('User not found.'));

  return deletedRecord;
}
