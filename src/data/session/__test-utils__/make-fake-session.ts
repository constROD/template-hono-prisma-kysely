import { type DbClient } from '@/db/create-db-client';
import { type Session } from '@/db/schema';
import { faker } from '@faker-js/faker';

export function makeFakeSession(overrides?: Partial<Session>) {
  return {
    id: faker.string.uuid(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    deleted_at: null,
    refresh_token: faker.string.uuid(),
    account_id: faker.string.uuid(),
    ...overrides,
  } satisfies Session;
}

export type CreateTestSessionsInDBArgs = {
  dbClient: DbClient;
  values?: Partial<Session> | Partial<Session>[];
};

export async function createTestSessionsInDB({ dbClient, values }: CreateTestSessionsInDBArgs) {
  const fakeSessions = Array.isArray(values)
    ? values.map(makeFakeSession)
    : makeFakeSession(values);
  const createdSessions = await dbClient
    .insertInto('sessions')
    .values(fakeSessions)
    .returningAll()
    .execute();
  return createdSessions;
}
