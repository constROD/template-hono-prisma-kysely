import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB, makeFakeUser } from './__test-utils__/make-fake-user';
import { searchUsersData } from './search-users';

const setupTestData = async ({
  dbClient,
  users,
}: {
  dbClient: DbClient;
  users: Partial<User>[];
}) => {
  await createTestUsersInDB({ dbClient, values: users });
};

const mockUser1 = makeFakeUser({ first_name: 'John', last_name: 'Doe', email: 'john@example.com' });
const mockUser2 = makeFakeUser({
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane@example.com',
});
const mockUser3 = makeFakeUser({
  first_name: 'Bob',
  last_name: 'Johnson',
  email: 'bob@example.com',
});

describe('Search Users', () => {
  testWithDbClient('should search users with pagination', async ({ dbClient }) => {
    await setupTestData({ dbClient, users: [mockUser1, mockUser2, mockUser3] });

    const result = await searchUsersData({
      dbClient,
      limit: 10,
      page: 1,
    });

    expect(result.records).toHaveLength(3);
    expect(result.total_records).toBe(3);
    expect(result.current_page).toBe(1);
  });

  testWithDbClient('should return empty array when no users exist', async ({ dbClient }) => {
    const result = await searchUsersData({ dbClient });

    expect(result.records).toHaveLength(0);
    expect(result.total_records).toBe(0);
  });

  testWithDbClient('should return the correct pagination data', async ({ dbClient }) => {
    const mockUsers = Array.from({ length: 30 }).map((_, idx) =>
      makeFakeUser({ first_name: `User${idx}`, last_name: `Test${idx}` })
    );

    await setupTestData({ dbClient, users: mockUsers });

    const result = await searchUsersData({
      dbClient,
      limit: 25,
      page: 1,
    });

    expect(result.records).toHaveLength(25);
    expect(result.total_records).toBe(30);
    expect(result.total_pages).toBe(2);
    expect(result.current_page).toBe(1);
    expect(result.next_page).toBe(2);
    expect(result.previous_page).toBe(null);
  });

  testWithDbClient('should search users with specific search text', async ({ dbClient }) => {
    await setupTestData({ dbClient, users: [mockUser1, mockUser2, mockUser3] });

    const result = await searchUsersData({
      dbClient,
      filters: { searchText: 'jane' },
    });

    expect(result.records).toHaveLength(1);
    expect(result.total_records).toBe(1);
    expect(result.records[0]?.first_name).toBe('Jane');
  });
});
