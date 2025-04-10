import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { makeFakeUser } from './__test-utils__/make-fake-user';
import { createUserData } from './create-user';

const mockUser = makeFakeUser();

describe('Create User', () => {
  testWithDbClient('should create a user', async ({ dbClient }) => {
    const createdUser = await createUserData({ dbClient, values: mockUser });

    expect(createdUser).toBeDefined();
    expect(createdUser?.id).toBeDefined();
    expect(createdUser?.email).toEqual(mockUser.email);
    expect(createdUser?.role).toEqual(mockUser.role);
    expect(createdUser?.created_at).toBeDefined();
    expect(createdUser?.updated_at).toBeDefined();

    const currentUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(currentUsers.length).toBe(1);
  });
});
