import type { DbClient } from '@/db/create-db-client';
import { BadRequestError, NotFoundError } from '@/utils/errors';

export type GetSessionDataArgs = {
  dbClient: DbClient;
  id?: string;
  accountId?: string;
};

export async function getSessionData({ dbClient, id, accountId }: GetSessionDataArgs) {
  if (!id && !accountId) {
    throw new BadRequestError('Either id or accountId must be provided.');
  }

  let baseQuery = dbClient.selectFrom('sessions');

  if (id) {
    baseQuery = baseQuery.where('id', '=', id);
  }

  if (accountId) {
    baseQuery = baseQuery.where('account_id', '=', accountId);
  }

  const record = await baseQuery
    .selectAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('Session not found.'));
  return record;
}
