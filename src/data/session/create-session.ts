import { type DbClient } from '@/db/create-db-client';
import { BadRequestError } from '@/utils/errors';
import { type CreateSession } from './schema';

export type CreateSessionDataArgs = {
  dbClient: DbClient;
  values: CreateSession;
};

export async function createSessionData({ dbClient, values }: CreateSessionDataArgs) {
  const createdRecord = await dbClient
    .insertInto('sessions')
    .values(values)
    .returningAll()
    .executeTakeFirstOrThrow(() => new BadRequestError('Failed to create session.'));
  return createdRecord;
}
