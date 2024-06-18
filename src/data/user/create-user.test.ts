import { createTestDbClient } from '@/db/create-db-client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { deleteAllRecords } from '../__test-utils__/delete-all-records';
import { makeFakeUser } from '../__test-utils__/make-fake-user';
import { createUserData } from './create-user';

const dbClient = createTestDbClient();

describe('Create User', () => {
  beforeEach(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  afterAll(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  it('should create a user', async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
    const fakeUser = makeFakeUser();

    const createdUser = await createUserData({ dbClient, values: fakeUser });

    expect(createdUser).toBeDefined();
    expect(createdUser?.id).toBeDefined();
    expect(createdUser?.email).toEqual(fakeUser.email);
    expect(createdUser?.created_at).toBeDefined();
    expect(createdUser?.updated_at).toBeDefined();

    const currentUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(currentUsers.length).toBe(1);
  });
});
