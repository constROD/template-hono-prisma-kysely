import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { makeFakeUser } from './__test-utils__/make-fake-user';
import { createUsersData } from './create-users';

describe('Create User', () => {
  testWithDbClient('should create a user', async ({ dbClient }) => {
    const fakeUser = makeFakeUser();

    const [createdUser] = await createUsersData({ dbClient, values: fakeUser });

    expect(createdUser).toBeDefined();
    expect(createdUser?.id).toBeDefined();
    expect(createdUser?.email).toEqual(fakeUser.email);
    expect(createdUser?.role).toEqual(fakeUser.role);
    expect(createdUser?.created_at).toBeDefined();
    expect(createdUser?.updated_at).toBeDefined();

    const currentUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(currentUsers.length).toBe(1);
  });

  testWithDbClient('should create multiple users', async ({ dbClient }) => {
    const count = 5;
    const fakeUsers = Array.from({ length: count }, makeFakeUser);

    const createdUsers = await createUsersData({ dbClient, values: fakeUsers });

    const currentUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(fakeUsers.length).toBe(count);
    expect(createdUsers.length).toBe(count);
    expect(currentUsers.length).toBe(count);
  });
});
