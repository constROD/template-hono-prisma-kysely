import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB, makeFakeUser } from './__test-utils__/make-fake-user';
import { getUsersData } from './get-users';

const setupTestData = async ({
  dbClient,
  users,
}: {
  dbClient: DbClient;
  users: Partial<User>[];
}) => {
  await createTestUsersInDB({ dbClient, values: users });
};

describe('Get Users', () => {
  testWithDbClient('should get users with pagination', async ({ dbClient }) => {
    const count = 10;
    const mockUsers = Array.from({ length: count }).map((_, idx) =>
      makeFakeUser({ first_name: `User${idx}` })
    );
    await setupTestData({ dbClient, users: mockUsers });

    const { records, total_records } = await getUsersData({ dbClient });

    expect(records.length).toBe(count);
    expect(total_records).toBe(count);
  });

  testWithDbClient('should return empty array when no users exist', async ({ dbClient }) => {
    const { records, total_records } = await getUsersData({ dbClient });

    expect(records.length).toBe(0);
    expect(total_records).toBe(0);
  });

  testWithDbClient('should return the correct pagination data', async ({ dbClient }) => {
    const count = 100;
    const mockUsers = Array.from({ length: count }).map((_, idx) =>
      makeFakeUser({ first_name: `User${idx}` })
    );
    await setupTestData({ dbClient, users: mockUsers });

    const { records, total_records, total_pages, current_page, next_page, previous_page } =
      await getUsersData({ dbClient });

    expect(records.length).toBe(25);
    expect(total_records).toBe(count);
    expect(total_pages).toBe(4);
    expect(current_page).toBe(1);
    expect(next_page).toBe(2);
    expect(previous_page).toBe(null);
  });
});
