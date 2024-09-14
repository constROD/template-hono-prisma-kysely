import { deleteAllRecords } from '@/data/__test-utils__/delete-all-records';
import { createTestDbClient } from '@/db/create-db-client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestUsersInDB } from '../__test-utils__/make-fake-user';
import { getUsersData } from './get-users';
import { searchUsersData } from './search-users';

const dbClient = createTestDbClient();

describe('Search Users', () => {
  beforeEach(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  afterAll(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  it('should get a users', async () => {
    const count = 10;
    const promiseArray = Array.from({ length: count }).map(() => createTestUsersInDB({ dbClient }));

    await Promise.all(promiseArray);

    const { records, totalRecords } = await getUsersData({ dbClient });

    expect(records.length).toBe(count);
    expect(totalRecords).toBe(count);
  });

  it('should return empty array when no user', async () => {
    const { records, totalRecords } = await getUsersData({ dbClient });

    expect(records.length).toBe(0);
    expect(totalRecords).toBe(0);
  });

  it('should search users with specific search text', async () => {
    const specificUser = await createTestUsersInDB({
      dbClient,
      values: {
        first_name: 'John',
        last_name: 'Doe',
      },
    });

    const { records, totalRecords } = await searchUsersData({ dbClient, searchText: 'John' });

    expect(records.length).toBe(1);
    expect(totalRecords).toBe(1);
    expect(records[0]?.id).toBe(specificUser[0]?.id);
  });
});
