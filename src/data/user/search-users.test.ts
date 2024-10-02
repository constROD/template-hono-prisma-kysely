import { deleteAllRecords } from '@/data/__test-utils__/delete-all-records';
import { createTestDbClient } from '@/db/create-db-client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestUsersInDB } from '../__test-utils__/make-fake-user';
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

  it('should return empty array when no user', async () => {
    const { records, total_records } = await searchUsersData({ dbClient });

    expect(records.length).toBe(0);
    expect(total_records).toBe(0);
  });

  it('should return the correct pagination data', async () => {
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

  it('should search users with specific search text', async () => {
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
