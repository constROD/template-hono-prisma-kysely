import { deleteAllRecords } from '@/data/__test-utils__/delete-all-records';
import { createTestDbClient } from '@/db/create-db-client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestUsersInDB } from '../__test-utils__/make-fake-user';
import { getUsersData } from './get-users';

const dbClient = createTestDbClient();

describe('Get Users', () => {
  beforeEach(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  afterAll(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  it('should get a users', async () => {
    const count = 10;

    await createTestUsersInDB({
      dbClient,
      values: Array.from({ length: count }).map((_, idx) => ({
        first_name: `John ${idx}`,
      })),
    });

    const { records, totalRecords } = await getUsersData({ dbClient });

    expect(records.length).toBe(count);
    expect(totalRecords).toBe(count);
  });

  it('should return empty array when no user', async () => {
    const { records, totalRecords } = await getUsersData({ dbClient });

    expect(records.length).toBe(0);
    expect(totalRecords).toBe(0);
  });

  it('should return the correct pagination data', async () => {
    const count = 100;

    await createTestUsersInDB({
      dbClient,
      values: Array.from({ length: count }).map((_, idx) => ({
        first_name: `John ${idx}`,
      })),
    });

    const { records, totalRecords, totalPages, currentPage, nextPage, previousPage } =
      await getUsersData({ dbClient });

    expect(records.length).toBe(25);
    expect(totalRecords).toBe(count);
    expect(totalPages).toBe(4);
    expect(currentPage).toBe(1);
    expect(nextPage).toBe(2);
    expect(previousPage).toBe(null);
  });
});
