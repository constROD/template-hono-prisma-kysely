import { type DbClient } from '@/db/create-db-client';
import { sql } from 'kysely';

type ArchiveUserDataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function archiveUserData({ dbClient, id }: ArchiveUserDataArgs) {
  const [archivedUser] = await dbClient
    .updateTable('users')
    .set({ deleted_at: sql`NOW()` })
    .where('id', '=', id)
    .returningAll()
    .execute();

  return archivedUser;
}
