import { type DbClient } from '@/db/create-db-client';
import { formatDateToISO } from '@/utils/date';
import { sql } from 'kysely';

export type GetCurrentServerDateDataArgs = {
  dbClient: DbClient;
};

export async function getCurrentServerDateData({ dbClient }: GetCurrentServerDateDataArgs) {
  const {
    rows: [serverData],
  } = await sql<{ server_date: Date }>`SELECT CURRENT_TIMESTAMP AS server_date`.execute(dbClient);
  if (!serverData?.server_date) throw new Error('Unable to get server date.');
  return formatDateToISO(serverData?.server_date);
}
