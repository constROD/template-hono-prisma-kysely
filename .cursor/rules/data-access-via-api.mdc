---
description: Guidelines for Data Access Layer via API
globs: 
alwaysApply: false
---
# Guidelines for Data Access Layer via API 

## Purpose & Overview
These rules define the standard patterns for implementing CRUD operations in the data access layer. The guidelines are based on the implementation of the 'users' module and should be followed for all API operations to maintain consistency across the codebase.

## File Structure

### Shared Domain

By default, place all data access files in the shared data directory. Only use feature domains when explicitly specified in requirements.

```
src/data/[entity-name]/
├── create-[entity].ts      # Create operation
├── get-[entity].ts         # Get single entity
├── get-[entity]s.ts        # Get multiple entities
├── update-[entity].ts      # Update operation
├── delete-[entity].ts      # Delete operation
├── search-[entity]s.ts     # Search with filters
└── __test-utils__/         # Test utilities
```

### Feature Domain

When a prompt/requirement explicitly specifies that code should be organized in a feature domain, follow this structure:

```
src/features/[feature-name]/
└── _data/[entity-name]/    # Feature-specific data access layer
    ├── create-[entity].ts  # Create operation
    ├── get-[entity].ts     # Get single entity
    ├── get-[entity]s.ts    # Get multiple entities
    ├── update-[entity].ts  # Update operation
    ├── delete-[entity].ts  # Delete operation
    ├── search-[entity]s.ts # Search with filters
    └── __test-utils__/     # Test utilities
```

## Naming Conventions

### Function Naming
- `create[Entity]Data`: For creating resources via API
- `get[Entity]Data`: For retrieving a single resource via API
- `get[Entity]sData`: For retrieving multiple resources via API
- `update[Entity]Data`: For updating resources via API
- `delete[Entity]Data`: For deleting resources via API
- `search[Entity]sData`: For searching resources with filters via API

### Type Naming
- `[Entity]`: Main entity type from API schema
- `Create[Entity]`: Type for creating entity, typically omitting auto-generated fields
- `Update[Entity]`: Type for updating entity, typically partial of the main entity
- `[Operation][Entity]DataArgs`: Type for function arguments
- `[Operation][Entity]DataResponse`: Type for function return value

## Implementation Patterns


## Test Utilities
Create test utilities in the `__test-utils__` directory to help with testing:

```typescript
// __test-utils__/make-fake-entity.ts
import { type Entity } from '@/data/schema';
import { faker } from '@faker-js/faker';

// Create a fake entity with realistic test data
export function makeFake[Entity] {
  return {
    id: faker.string.uuid(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    deleted_at: null,
    // ... entity-specific fields with realistic fake data
    ...overrides,
  } satisfies Entity;
}
```

### Create Operation
```typescript
// create-[entity].ts
import { type Entity } from './schema';

export type CreateEntityDataArgs = {
  // Entity properties to be sent to API
};

export async function createEntityData(args: CreateEntityDataArgs): Promise<Entity> {
  const response = await fetch('https://api.example.com/entities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return await response.json();
}
```