import type { DbClient } from '@/db/create-db-client';
import type { Product, User } from '@/db/schema';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB, makeFakeUser } from '../users/__test-utils__/make-fake-user';
import { createTestProductsInDB, makeFakeProduct } from './__test-utils__/make-fake-product';
import { searchProductsData } from './search-products';

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

describe('Search Products', () => {
  testWithDbClient('should search products by text', async ({ dbClient }) => {
    await setupTestData({
      dbClient,
      users: [mockUser],
      products: [
        {
          name: 'iPhone 14',
          description: 'Latest Apple phone',
          user_id: mockUser.id,
        },
        {
          name: 'Samsung Galaxy',
          description: 'Android flagship',
          user_id: mockUser.id,
        },
        {
          name: 'Google Pixel',
          description: 'Pure Android experience',
          user_id: mockUser.id,
        },
      ],
    });

    const { records, total_records } = await searchProductsData({
      dbClient,
      filters: { searchText: 'iphone' },
    });

    expect(records.length).toBe(1);
    expect(total_records).toBe(1);
    expect(records[0]?.name).toBe('iPhone 14');
  });

  testWithDbClient('should handle sorting by product fields', async ({ dbClient }) => {
    await setupTestData({
      dbClient,
      users: [mockUser],
      products: [
        { name: 'A Product', user_id: mockUser.id },
        { name: 'B Product', user_id: mockUser.id },
        { name: 'C Product', user_id: mockUser.id },
      ],
    });

    const { records } = await searchProductsData({
      dbClient,
      sortBy: 'name',
      orderBy: 'desc',
    });

    expect(records[0]?.name).toBe('C Product');
    expect(records[2]?.name).toBe('A Product');
  });

  testWithDbClient('should handle pagination correctly', async ({ dbClient }) => {
    const count = 30;
    const mockProducts = Array.from({ length: count }).map((_, idx) =>
      makeFakeProduct({ name: `Product ${idx}`, user_id: mockUser.id })
    );

    await setupTestData({ dbClient, users: [mockUser], products: mockProducts });

    const { records, total_records, total_pages, current_page, next_page, previous_page } =
      await searchProductsData({
        dbClient,
        limit: 10,
        page: 2,
      });

    expect(records.length).toBe(10);
    expect(total_records).toBe(count);
    expect(total_pages).toBe(3);
    expect(current_page).toBe(2);
    expect(next_page).toBe(3);
    expect(previous_page).toBe(1);
  });

  testWithDbClient('should handle archived products', async ({ dbClient }) => {
    await setupTestData({
      dbClient,
      users: [mockUser],
      products: [
        { name: 'Active Product', user_id: mockUser.id },
        { name: 'Archived Product', deleted_at: new Date(), user_id: mockUser.id },
      ],
    });

    const excludeArchived = await searchProductsData({ dbClient });
    expect(excludeArchived.records.length).toBe(1);
    expect(excludeArchived.records[0]?.name).toBe('Active Product');

    const includeArchived = await searchProductsData({ dbClient, includeArchived: true });
    expect(includeArchived.records.length).toBe(2);
  });
});
