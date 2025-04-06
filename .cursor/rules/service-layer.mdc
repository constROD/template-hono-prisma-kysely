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
import { getUserData } from '@/data/users/get-user';
import { getFeatureFlagData } from '@/data/feature-flags/get-feature-flag';
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
```

## When to Use Service Layer

Services should be used when:

1. You need to coordinate multiple data access operations
2. There is complex business logic to implement
3. You need to transform or validate data before returning it
4. You need to handle specific error cases or implement retry logic
5. You want to make the code more testable through dependency injection

If an operation is simple and only involves a single data access call with minimal transformation, it might not need a service layer.