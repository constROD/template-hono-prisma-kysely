import { type DbClient } from '@/db/create-db-client';
import { sql } from 'kysely';
import { getUserData } from './get-user';

export type ArchiveUserDataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function archiveUserData({ dbClient, id }: ArchiveUserDataArgs) {
  await getUserData({ dbClient, id });

  const archivedRecord = await dbClient
    .updateTable('users')
    .set({ deleted_at: sql`NOW()` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();

  return archivedRecord;
}
