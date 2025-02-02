import { type DbClient } from '@/db/create-db-client';
import { NotFoundError } from '@/utils/errors';

export type GetSessionDataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function getSessionData({ dbClient, id }: GetSessionDataArgs) {
  const record = await dbClient
    .selectFrom('sessions')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('Session not found.'));
  return record;
}
