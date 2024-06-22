import { deleteAllRecords } from '@/data/__test-utils__/delete-all-records';
import { createTestDbClient } from '@/db/create-db-client';
import { faker } from '@faker-js/faker';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestUsersInDB } from '../__test-utils__/make-fake-user';
import { archiveUserData } from './archive-user';

const dbClient = createTestDbClient();

describe('Archive User', () => {
  beforeEach(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  afterAll(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  it('should archive a user', async () => {
    const [testCreatedUser] = await createTestUsersInDB({ dbClient });

    if (!testCreatedUser) throw new Error('testCreatedUser is undefined');

    const beforeUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(testCreatedUser.id).toBe(beforeUsers[0]?.id);
    expect(testCreatedUser.deleted_at).toBeNull();
    expect(beforeUsers.length).toBe(1);
    expect(beforeUsers[0]?.deleted_at).toBeNull();

    const archivedUser = await archiveUserData({ dbClient, id: testCreatedUser.id });
    const afterUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(testCreatedUser?.id).toBe(afterUsers[0]?.id);
    expect(archivedUser?.id).toEqual(testCreatedUser.id);
    expect(archivedUser?.deleted_at).toBeDefined();
  });

  it('should return undefined when no user', async () => {
    const archivedUser = await archiveUserData({ dbClient, id: faker.string.uuid() });

    expect(archivedUser).toBeUndefined();
  });
});
