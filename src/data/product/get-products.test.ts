import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB, makeFakeUser } from '../user/__test-utils__/make-fake-user';
import { createTestProductsInDB } from './__test-utils__/make-fake-product';
import { getProductsData } from './get-products';

const fakeUser = makeFakeUser();

describe('Get Products', () => {
  testWithDbClient('should get a products', async ({ dbClient }) => {
    const count = 10;
    const fakeProducts = Array.from({ length: count }).map((_, idx) => ({
      name: `Product ${idx}`,
      user_id: fakeUser.id,
    }));

    await createTestUsersInDB({ dbClient, values: fakeUser });
    await createTestProductsInDB({ dbClient, values: fakeProducts });

    const { records, total_records } = await getProductsData({ dbClient });

    expect(records.length).toBe(count);
    expect(total_records).toBe(count);
  });

  testWithDbClient('should return empty array when no product', async ({ dbClient }) => {
    const { records, total_records } = await getProductsData({ dbClient });

    expect(records.length).toBe(0);
    expect(total_records).toBe(0);
  });

  testWithDbClient('should return the correct pagination data', async ({ dbClient }) => {
    const count = 100;
    const fakeProducts = Array.from({ length: count }).map((_, idx) => ({
      name: `Product ${idx}`,
      user_id: fakeUser.id,
    }));

    await createTestUsersInDB({ dbClient, values: fakeUser });
    await createTestProductsInDB({ dbClient, values: fakeProducts });

    const { records, total_records, total_pages, current_page, next_page, previous_page } =
      await getProductsData({ dbClient });

    expect(records.length).toBe(25);
    expect(total_records).toBe(count);
    expect(total_pages).toBe(4);
    expect(current_page).toBe(1);
    expect(next_page).toBe(2);
    expect(previous_page).toBe(null);
  });
});
