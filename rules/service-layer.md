---
description: Guidelines for Service Layer
globs: **/services/**/*.ts, **/_services/**/*.ts
alwaysApply: false
---
# Guidelines for Service Layer

## Purpose and Overview
The service layer is responsible for orchestrating business logic and coordinating data access operations. It sits between the UI (components, hooks) and the data access layer, providing a clear separation of concerns. Services should handle:

1. Orchestration of multiple data operations
2. Business logic implementation
3. Data transformation and validation
4. Error handling and logging

## Structure and Organization

### Service Layer Module Structure
```
src/
├── services/                       # Shared service layer module
│   └── [entity]
        └── [operation-entity-name].ts  # Shared service implementations
└── features/
    └── [feature-name]/
        └── _services/              # Feature-specific services
            └── [operation-entity-name].ts  # Feature-specific service implementations
```

## Naming Conventions

### Functions
- `[operation][Entity]Service`: For service functions (e.g., `getFeatureFlagService`, `createUserService`)

### Types
- `[Operation][Entity]ServiceArgs`: Arguments for service functions
- `[Operation][Entity]ServiceDependencies`: Dependencies for service functions
- `[Operation][Entity]ServiceResult`: Return type for service functions (if needed)

## Implementation Guidelines

### Service Layer
- Services should receive data access functions as dependencies
- Dependencies should be injected with default values
- Services should be pure functions that don't manage state
- Services should handle error cases and transformations
- Services should be testable by allowing dependency injection

### Example Service Function
```typescript
import { getFeatureFlagData } from '@/data/feature-flags/get-feature-flag';
import { getUserData } from '@/data/users/get-user';
import { type DbClient } from '@/db/create-db-client';
import { type Session } from '@/types/auth';

export type GetFeatureFlagServiceDependencies = {
  getUserData: typeof getUserData;
  getFeatureFlagData: typeof getFeatureFlagData;
};

export type GetFeatureFlagServiceArgs = {
  dbClient: DbClient;
  payload: { session: Session };
  dependencies?: GetFeatureFlagServiceDependencies;
};

export async function getFeatureFlagService({
  dbClient,
  payload,
  dependencies = {
    getUserData,
    getFeatureFlagData,
  },
}: GetFeatureFlagServiceArgs) {
  const userData = await dependencies.getUserData({
    dbClient,
    id: payload.session.id,
  });

  const featureFlagData = await dependencies.getFeatureFlagData({
    dbClient,
    role: userData.role,
  });

  return featureFlagData;
}

export type GetFeatureFlagServiceResponse = Awaited<ReturnType<typeof getFeatureFlagService>>;
```

### Example Service Testing
```typescript
import { makeFakeUser } from '@/data/users/__test-utils__/make-fake-user';
import { mockDbClient } from '@/db/__test-utils__/mock-db-client';
import { UserRoleType } from '@/db/types';
import { mockSession } from '@/middlewares/__test-utils__/openapi-hono';
import { NotFoundError } from '@/utils/errors';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getFeatureFlagService } from './get-feature-flag';

const mockDependencies = {
  getUserData: vi.fn(),
  getFeatureFlagData: vi.fn(),
};

const mockUser = makeFakeUser({
  email: 'test@example.com',
  role: UserRoleType.USER,
  first_name: 'Test',
  last_name: 'User',
});

const mockFeatureFlag = {
  id: faker.string.uuid(),
  role: UserRoleType.USER,
  json: { feature1: true, feature2: false },
};

describe('getFeatureFlagService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully get feature flags for user', async () => {
    const payload = {
      session: mockSession,
    };

    mockDependencies.getUserData.mockResolvedValue(mockUser);
    mockDependencies.getFeatureFlagData.mockResolvedValue(mockFeatureFlag);

    const result = await getFeatureFlagService({
      dbClient: mockDbClient.dbClient,
      payload,
      dependencies: mockDependencies,
    });

    expect(mockDependencies.getUserData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      id: payload.session.id,
    });

    expect(mockDependencies.getFeatureFlagData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      role: mockUser.role,
    });

    expect(result).toEqual(mockFeatureFlag);
  });

  it('should throw NotFoundError when user is not found', async () => {
    const payload = {
      session: mockSession,
    };

    mockDependencies.getUserData.mockRejectedValue(new NotFoundError('User not found.'));

    await expect(
      getFeatureFlagService({
        dbClient: mockDbClient.dbClient,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new NotFoundError('User not found.'));

    expect(mockDependencies.getUserData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      id: payload.session.id,
    });

    expect(mockDependencies.getFeatureFlagData).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when feature flag is not found', async () => {
    const payload = {
      session: mockSession,
    };

    mockDependencies.getUserData.mockResolvedValue(mockUser);
    mockDependencies.getFeatureFlagData.mockRejectedValue(
      new NotFoundError('Feature flag not found.')
    );

    await expect(
      getFeatureFlagService({
        dbClient: mockDbClient.dbClient,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new NotFoundError('Feature flag not found.'));

    expect(mockDependencies.getUserData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      id: payload.session.id,
    });

    expect(mockDependencies.getFeatureFlagData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      role: mockUser.role,
    });
  });
});
```

## When to Use Service Layer

Services should be used when:

1. You need to coordinate multiple data access operations
2. There is complex business logic to implement
3. You need to transform or validate data before returning it
4. You need to handle specific error cases or implement retry logic
5. You want to make the code more testable through dependency injection

If an operation is simple and only involves a single data access call with minimal transformation, it might not need a service layer.