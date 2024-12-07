import { type DbClient } from '@/db/create-db-client';
import { ValidationError } from '@/utils/errors';
import { type CreateUser } from './schema';

export type CreateUserDataArgs = {
  dbClient: DbClient;
  values: CreateUser;
};

export async function createUserData({ dbClient, values }: CreateUserDataArgs) {
  const createdRecord = await dbClient
    .insertInto('users')
    .values(values)
    .returningAll()
    .executeTakeFirstOrThrow(() => new ValidationError('Unable to create user.'));

  return createdRecord;
}
