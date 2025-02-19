import { type DbClient } from '@/db/create-db-client';
import { BadRequestError } from '@/utils/errors';

export type GetSessionDataArgs = {
  dbClient: DbClient;
  id?: string;
  refreshToken?: string;
};

export async function getSessionData({ dbClient, id, refreshToken }: GetSessionDataArgs) {
  if (!id && !refreshToken) {
    throw new BadRequestError('Either id or refreshToken must be provided.');
  }

  let baseQuery = dbClient.selectFrom('sessions');

  if (id) {
    baseQuery = baseQuery.where('id', '=', id);
  }

  if (refreshToken) {
    baseQuery = baseQuery.where('refresh_token', '=', refreshToken);
  }

  const record = await baseQuery.selectAll().executeTakeFirst();
  return record;
}
