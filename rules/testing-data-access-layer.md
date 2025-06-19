---
description: 
globs: **/data/**/*.test.ts,**/_data/**/*.test.ts
alwaysApply: false
---
# Guidelines for Testing the Data Access Layer

## Purpose & Overview
These guidelines define the standard patterns for implementing tests for the data access layer. The testing approach varies based on whether data access is via database or API.

## Core Testing Approaches

### Database Access Testing
Database tests use transaction rollbacks to ensure test isolation and reset state between tests.

#### Key Components
- `testWithDbClient`: Provides isolated transaction wrappers that automatically roll back
- `makeFake[Entity]`: Creates fake entity instances with realistic test data
- `createTest[Entity]sInDB`: Sets up test data in the database
- `setupTestData`: Helper function to prepare test data for each test case

#### Example Test Pattern for Data Access Layer via Database 
```typescript
import { type DbClient } from '@/db/create-db-client';
import { type User, type Product } from '@/db/schema';
import { createProductData } from './create-product';
import { createTestProductsInDB, makeProduct } from './__test-utils__/make-fake-product';
import { createTestUsersInDB, makeFakeUser } from '../users/__test-utils__/make-fake-user';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';

// Essential test setup pattern for DB tests
const setupTestData = async ({
  dbClient,
  users, 
  products
  // or other entities
}: {
  dbClient: DbClient;
  users: Partial<User>[];
  products: Partial<Product>[];
  // or other entities
}) => {
  await createTestUsersInDB({ dbClient, values: users });
  await createTestProductsInDB({ dbClient, values: products });
  // or other entities
};

const mockUser = makeFakeUser();

describe('Create Product', () => {
  testWithDbClient('should create a user', async ({ dbClient }) => {
    const mockProduct = makeFakeProduct({ user_id: mockUser.id }) // w/ Foreign Keys

    const createdProduct = await createProductData({ dbClient, values: mockProduct });

    expect(createdProduct).toBeDefined();
    expect(createdProduct?.id).toBeDefined();
    expect(createdProduct?.price).toEqual(mockProduct.price);
    expect(createdProduct?.user_id).toEqual(mockProduct.user_id);
    expect(createdProduct?.created_at).toBeDefined();
    expect(createdProduct?.updated_at).toBeDefined();

    const currentProducts = await dbClient.selectFrom('products').selectAll().execute();

    expect(currentProducts.length).toBe(1);
  });

  // ... more tests
});
```

### API Access Testing
API tests use mocking to isolate from external dependencies.

#### Key Components
- API mocking libraries (MSW, Nock, or similar)
- Response fixtures
- Network isolation

#### Example Test Pattern for Data Access Layer via API
```typescript
// Essential test setup pattern for API tests
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { makeFakeUser } from './__test-utils__/make-fake-user';

// Mock server setup
const server = setupServer(
  rest.get('https://api.example.com/users/:id', (req, res, ctx) => {
    return res(ctx.json(makeFakeUser));
  }),
  // Additional endpoint mocks
);

beforeAll(() => server());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Get User', () => {
  test('should get a user by ID', async () => {
    // Execute the function under test
    const user = await getUserData({ id: 'mock-id' });
    
    // Assert results
    expect(user.id).toBe('mock-id');
    expect(user.name).toBe('John Doe');
  });
  
  test('should handle API errors', async () => {
    // Override the mock for this test
    server.use(
      rest.get('https://api.example.com/users/:id', (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );
    
    // Execute and assert
    await expect(getUserData({ id: 'non-existent' }))
      .rejects.toThrow('User not found');
  });
});
```

## Important Note
- Don't forget to run the `pnpm test <file_or_folder_path>` after the creation of tests.

## Best Practices

1. **Isolation**: Each test should be independent with its own setup
2. **Focused Testing**: Test only one aspect of functionality per test
3. **Realistic Data**: Use realistic fake data that resembles production
4. **Error Handling**: Test both success and error cases
5. **Mock Responses**: For API tests, mock responses that match production API format

## Key Test Scenarios

### DB Specific Scenarios
- **Transaction Handling**: Test transaction commit/rollback behavior
- **Database Constraints**: Test uniqueness and referential integrity constraints
- **Soft Delete**: Test behavior with both active and archived records

### API Specific Scenarios
- **Network Failures**: Test timeouts and connection errors
- **Rate Limiting**: Test handling of rate limit responses
- **Authentication**: Test token expiry and invalid credentials
- **Pagination Headers**: Test handling of cursor-based or header-based pagination 