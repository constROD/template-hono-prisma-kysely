import { type DbClient } from '@/db/create-db-client';

export type RevokeSessionDataArgs = {
  dbClient: DbClient;
  accountId: string;
};

export async function revokeSessionData({ dbClient, accountId }: RevokeSessionDataArgs) {
  const revokedSession = await dbClient
    .deleteFrom('sessions')
    .where('account_id', '=', accountId)
    .returningAll()
    .executeTakeFirst();

  return revokedSession;
}
