import { type DbClient } from '@/db/create-db-client';
import { type Product, type User } from '@/db/schema';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB, makeFakeUser } from '../users/__test-utils__/make-fake-user';
import { createTestProductsInDB, makeFakeProduct } from './__test-utils__/make-fake-product';
import { getProductsData } from './get-products';

const setupTestData = async ({
  dbClient,
  users,
  products,
}: {
  dbClient: DbClient;
  users: Partial<User>[];
  products: Partial<Product>[];
}) => {
  await createTestUsersInDB({ dbClient, values: users });
  await createTestProductsInDB({ dbClient, values: products });
};

const mockUser = makeFakeUser();

describe('Get Products', () => {
  testWithDbClient('should get products with pagination', async ({ dbClient }) => {
    const count = 10;
    const mockProducts = Array.from({ length: count }).map((_, idx) =>
      makeFakeProduct({ name: `Product${idx}`, user_id: mockUser.id })
    );

    await setupTestData({ dbClient, users: [mockUser], products: mockProducts });

    const { records, total_records } = await getProductsData({ dbClient });

    expect(records.length).toBe(count);
    expect(total_records).toBe(count);
  });

  testWithDbClient('should return empty array when no products exist', async ({ dbClient }) => {
    const { records, total_records } = await getProductsData({ dbClient });

    expect(records.length).toBe(0);
    expect(total_records).toBe(0);
  });

  testWithDbClient('should return the correct pagination data', async ({ dbClient }) => {
    const count = 100;
    const mockProducts = Array.from({ length: count }).map((_, idx) =>
      makeFakeProduct({ name: `Product${idx}`, user_id: mockUser.id })
    );

    await setupTestData({ dbClient, users: [mockUser], products: mockProducts });

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
