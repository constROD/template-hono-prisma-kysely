import { type DbClient } from '@/db/create-db-client';
import { type Session } from '@/db/schema';
import { overrideValueOrUseDefault } from '@/utils/guard';
import { faker } from '@faker-js/faker';

export function makeFakeSession(args?: Partial<Session>) {
  return {
    id: overrideValueOrUseDefault(args?.id, faker.string.uuid()),
    created_at: overrideValueOrUseDefault(args?.created_at, faker.date.recent()),
    updated_at: overrideValueOrUseDefault(args?.updated_at, faker.date.recent()),
    deleted_at: overrideValueOrUseDefault(args?.deleted_at, null),
    refresh_token: overrideValueOrUseDefault(args?.refresh_token, faker.string.uuid()),
    account_id: overrideValueOrUseDefault(args?.account_id, faker.string.uuid()),
  } satisfies Session;
}

export type CreateTestSessionsInDBArgs = {
  dbClient: DbClient;
  values?: Partial<Session> | Partial<Session>[];
};

export async function createTestSessionsInDB({ dbClient, values }: CreateTestSessionsInDBArgs) {
  const fakeSessions =
    values instanceof Array ? values.map(makeFakeSession) : makeFakeSession(values);
  const createdSessions = await dbClient
    .insertInto('sessions')
    .values(fakeSessions)
    .returningAll()
    .execute();
  return createdSessions;
}
