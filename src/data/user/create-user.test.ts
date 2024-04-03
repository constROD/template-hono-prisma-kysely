import { deleteAllRecords } from '@/data/__test-utils__/delete-all-records';
import { makeFakeUser } from '@/data/user/__test-utils__/make-fake-user';
import { createDbClient } from '@/db/create-db-client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createUser } from './create-user';

const dbClient = createDbClient();

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

    const createdUser = await createUser({ dbClient, values: fakeUser });

    expect(createdUser).toBeDefined();
    expect(createdUser?.id).toBeDefined();
    expect(createdUser?.email).toEqual(fakeUser.email);
    expect(createdUser?.created_at).toBeDefined();
    expect(createdUser?.updated_at).toBeDefined();

    const currentUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(currentUsers.length).toBe(1);
  });
});
