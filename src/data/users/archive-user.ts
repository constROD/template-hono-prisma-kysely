import { type DbClient } from '@/db/create-db-client';
import { NotFoundError } from '@/utils/errors';
import { sql } from 'kysely';

export type ArchiveUserDataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function archiveUserData({ dbClient, id }: ArchiveUserDataArgs) {
  const archivedRecord = await dbClient
    .updateTable('users')
    .set({ deleted_at: sql`NOW()` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('User not found.'));

  return archivedRecord;
}
