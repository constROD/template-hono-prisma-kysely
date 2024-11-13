import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB } from './__test-utils__/make-fake-user';
import { searchUsersData } from './search-users';

describe('Search Users', () => {
  testWithDbClient('should get a users', async ({ dbClient }) => {
    const count = 10;

    await createTestUsersInDB({
      dbClient,
      values: Array.from({ length: count }).map((_, idx) => ({
        first_name: `John ${idx}`,
      })),
    });

    const { records, total_records } = await searchUsersData({ dbClient });

    expect(records.length).toBe(count);
    expect(total_records).toBe(count);
  });

  testWithDbClient('should return empty array when no user', async ({ dbClient }) => {
    const { records, total_records } = await searchUsersData({ dbClient });

    expect(records.length).toBe(0);
    expect(total_records).toBe(0);
  });

  testWithDbClient('should return the correct pagination data', async ({ dbClient }) => {
    const count = 100;

    await createTestUsersInDB({
      dbClient,
      values: Array.from({ length: count }).map((_, idx) => ({
        first_name: `John ${idx}`,
      })),
    });

    const { records, total_records, total_pages, current_page, next_page, previous_page } =
      await searchUsersData({ dbClient });

    expect(records.length).toBe(25);
    expect(total_records).toBe(count);
    expect(total_pages).toBe(4);
    expect(current_page).toBe(1);
    expect(next_page).toBe(2);
    expect(previous_page).toBe(null);
  });

  testWithDbClient('should search users with specific search text', async ({ dbClient }) => {
    const specificUser = await createTestUsersInDB({
      dbClient,
      values: {
        first_name: 'John',
        last_name: 'Doe',
      },
    });

    const { records, total_records } = await searchUsersData({
      dbClient,
      filters: { searchText: 'John' },
    });

    expect(records.length).toBe(1);
    expect(total_records).toBe(1);
    expect(records[0]?.id).toBe(specificUser[0]?.id);
  });
});
