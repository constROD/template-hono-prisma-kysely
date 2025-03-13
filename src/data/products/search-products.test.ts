import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB, makeFakeUser } from '../users/__test-utils__/make-fake-user';
import { createTestProductsInDB, makeFakeProduct } from './__test-utils__/make-fake-product';
import { searchProductsData } from './search-products';

const fakeUser = makeFakeUser();

describe('Search Products', () => {
  testWithDbClient('should search products by text', async ({ dbClient }) => {
    const fakeProducts = [
      makeFakeProduct({
        name: 'iPhone 14',
        description: 'Latest Apple phone',
        user_id: fakeUser.id,
      }),
      makeFakeProduct({
        name: 'Samsung Galaxy',
        description: 'Android flagship',
        user_id: fakeUser.id,
      }),
      makeFakeProduct({
        name: 'Google Pixel',
        description: 'Pure Android experience',
        user_id: fakeUser.id,
      }),
    ];

    await createTestUsersInDB({ dbClient, values: fakeUser });
    await createTestProductsInDB({ dbClient, values: fakeProducts });

    const { records, total_records } = await searchProductsData({
      dbClient,
      filters: { searchText: 'iphone' },
    });

    expect(records.length).toBe(1);
    expect(total_records).toBe(1);
    expect(records[0]?.name).toBe('iPhone 14');
    expect(records[0]?.user_id).toBe(fakeUser.id);
  });

  testWithDbClient('should handle sorting by product fields', async ({ dbClient }) => {
    const fakeProducts = [
      makeFakeProduct({ name: 'A Product', user_id: fakeUser.id }),
      makeFakeProduct({ name: 'B Product', user_id: fakeUser.id }),
      makeFakeProduct({ name: 'C Product', user_id: fakeUser.id }),
    ];

    await createTestUsersInDB({ dbClient, values: fakeUser });
    await createTestProductsInDB({ dbClient, values: fakeProducts });

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
    const fakeProducts = Array.from({ length: count }).map((_, idx) =>
      makeFakeProduct({ name: `Product ${idx}`, user_id: fakeUser.id })
    );

    await createTestUsersInDB({ dbClient, values: fakeUser });
    await createTestProductsInDB({ dbClient, values: fakeProducts });

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
    const fakeProducts = [
      makeFakeProduct({ name: 'Active Product', user_id: fakeUser.id }),
      makeFakeProduct({ name: 'Archived Product', user_id: fakeUser.id, deleted_at: new Date() }),
    ];

    await createTestUsersInDB({ dbClient, values: fakeUser });
    await createTestProductsInDB({ dbClient, values: fakeProducts });

    const excludeArchived = await searchProductsData({ dbClient });
    expect(excludeArchived.records.length).toBe(1);
    expect(excludeArchived.records[0]?.name).toBe('Active Product');

    const includeArchived = await searchProductsData({ dbClient, includeArchived: true });
    expect(includeArchived.records.length).toBe(2);
  });
});
