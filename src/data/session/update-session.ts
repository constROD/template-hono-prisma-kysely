import { type DbClient } from '@/db/create-db-client';
import { NotFoundError } from '@/utils/errors';
import { sql } from 'kysely';
import { type UpdateSession } from './schema';

export type UpdateSessionDataArgs = {
  dbClient: DbClient;
  id: string;
  values: UpdateSession;
};

export async function updateSessionData({ dbClient, id, values }: UpdateSessionDataArgs) {
  const updatedRecord = await dbClient
    .updateTable('sessions')
    .set({ ...values, updated_at: sql`NOW()` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('Session not found.'));

  return updatedRecord;
}
