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

    expect(createdUser).toMatchObject({
      id: expect.any(String),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
      first_name: fakeUser.first_name,
      last_name: fakeUser.last_name,
      email: fakeUser.email,
      role: fakeUser.role,
    });

    const currentUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(currentUsers.length).toBe(1);
  });
});
