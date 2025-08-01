---
description: Guidelines for Data Access Layer via Database 
globs: 
alwaysApply: false
---
# Guidelines for Data Access Layer via Database 

## Purpose & Overview
These rules define the standard patterns for implementing CRUD operations in the data access layer. The guidelines are based on the implementation of the 'users' module and should be followed for all database operations to maintain consistency across the codebase.

## File Structure

### Shared Domain

By default, place all data access files in the shared data directory. Only use feature domains when explicitly specified in requirements.

```
src/data/[entity-name]/
├── schema.ts               # Entity schema definitions
├── create-[entity].ts      # Create operation
├── get-[entity].ts         # Get single entity
├── update-[entity].ts      # Update operation
├── delete-[entity].ts      # Delete operation
├── search-[entity]s.ts     # Search with filters
└── __test-utils__/         # Test utilities
```

### Feature Domain

When a prompt/requirement explicitly specifies that code should be organized in a feature domain, follow this structure:

```
src/features/[feature-name]/
└── _data/                  # Feature-specific data access layer
    ├── schema.ts           # Feature's schemas
    ├── create-[entity].ts  # Create operation
    ├── get-[entity].ts     # Get single entity
    ├── update-[entity].ts  # Update operation
    ├── delete-[entity].ts  # Delete operation
    ├── search-[entity]s.ts # Search with filters
    └── __test-utils__/     # Test utilities
```

## Naming Conventions

### Function Naming
- `create[Entity]Data`: For creating records
- `get[Entity]Data`: For retrieving a single record
- `update[Entity]Data`: For updating records
- `delete[Entity]Data`: For deleting records
- `search[Entity]sData`: For searching records with filters

### Type Naming
- `[Entity]`: Main entity type from schema
- `Create[Entity]`: Type for creating entity, typically omitting auto-generated fields
- `Update[Entity]`: Type for updating entity, typically partial of the main entity
- `[Operation][Entity]DataArgs`: Type for function arguments
- `[Operation][Entity]DataResponse`: Type for function return value

## Implementation Patterns

## Schema Implementation
The `schema.ts` file should define the entity's schema, types, and Zod validators:

```typescript
// schema.ts
import { type Entity } from '@/db/schema';
import { z } from '@hono/zod-openapi';

// Define schema object with Zod validators
export const [entity]SchemaObject = {
  id: z.string().uuid(),
  created_at: z.union([z.coerce.date(), z.string()]).openapi({
    example: new Date().toISOString(),
  }),
  updated_at: z.union([z.coerce.date(), z.string()]).openapi({
    example: new Date().toISOString(),
  }),
  deleted_at: z.union([z.coerce.date(), z.string()]).nullable().openapi({
    example: null,
  }),
  // ... add entity-specific fields with validation and OpenAPI examples
};

// Create Zod schema from schema object
export const [entity]Schema = z.object([entity]SchemaObject) satisfies z.ZodType<Entity>;
// Create OpenAPI schema for documentation
export const [entity]SchemaOpenApi = [entity]Schema.openapi('[Entity]');
// Create fields enum for dynamic field references
export const [entity]SchemaFields = z.enum(Object.keys([entity]SchemaObject) as [string, ...string[]]);
// Define derived types for operations
export type Create[Entity] = Omit<[Entity], 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type Update[Entity] = Partial<[Entity]>;
```

## Schema Registration
After creating the entity schema, it **must** be registered in the main `schema.ts` file located at `src/data/schema.ts` for OpenAPI documentation:

```typescript
// src/data/schema.ts
import { [entity]SchemaOpenApi } from './[entity-name]/schema';
// ... other schema imports

export const schemas = {
  // ... existing schemas
  [Entity]: [entity]SchemaOpenApi,
} as const;
```

This registration ensures that the schema is available for OpenAPI documentation generation and is properly included in the API documentation.

## Test Utilities
Create test utilities in the `__test-utils__` directory to help with testing:

```typescript
// __test-utils__/make-fake-entity.ts
import { type DbClient } from '@/db/create-db-client';
import { type Entity } from '@/db/schema';
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

// Helper to create test entities in the database
export type CreateTest[Entity]sInDBArgs = {
  dbClient: DbClient;
  values?: Partial<Entity> | Partial<Entity>[];
};

export async function createTest[Entity]sInDB({ dbClient, values }: CreateTest[Entity]sInDBArgs) {
  const fake[Entity]s = Array.isArray(values) 
    ? values.map(makeFakeEntity) 
    : makeFakeEntity(values);
    
  const created[Entity]s = await dbClient
    .insertInto('[entity_table]')
    .values(fakeEntities)
    .returningAll()
    .execute();
    
  return created[Entity]s;
}
```

### Create Operation
```typescript
// create-[entity].ts
export type Create[Entity]DataArgs = {
  dbClient: DbClient;
  values: Create[Entity];
};

export async function create[Entity]Data({ dbClient, values }: Create[Entity]DataArgs) {
  const createdRecord = await dbClient
    .insertInto('[entity_table]')
    .values(values)
    .returningAll()
    .executeTakeFirstOrThrow();
  return createdRecord;
}

export type Create[Entity]DataResponse = Awaited<ReturnType<typeof create[Entity]Data>>;
```

### Get Single Operation
```typescript
// get-[entity].ts
export type Get[Entity]DataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function get[Entity]Data({ dbClient, id }: Get[Entity]DataArgs) {
  const record = await dbClient
    .selectFrom('[entity_table]')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('[Entity] not found.'));

  return record;
}

export type Get[Entity]DataResponse = Awaited<ReturnType<typeof get[Entity]Data>>;
```

### Update Operation
```typescript
// update-[entity].ts
export type Update[Entity]DataArgs = {
  dbClient: DbClient;
  id: string;
  values: Update[Entity];
};

export async function update[Entity]Data({ dbClient, id, values }: Update[Entity]DataArgs) {
  const updatedRecord = await dbClient
    .updateTable('[entity_table]')
    .set({ ...values, updated_at: sql`NOW()` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('[Entity] not found.'));

  return updatedRecord;
}

export type Update[Entity]DataResponse = Awaited<ReturnType<typeof update[Entity]Data>>;
```

### Delete Operation
```typescript
// delete-[entity].ts
export type Delete[Entity]DataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function delete[Entity]Data({ dbClient, id }: Delete[Entity]DataArgs) {
  const deletedRecord = await dbClient
    .deleteFrom('[entity_table]')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('[Entity] not found.'));

  return deletedRecord;
}

export type Delete[Entity]DataResponse = Awaited<ReturnType<typeof delete[Entity]Data>>;
```

### Search Operation
```typescript
// search-[entity]s.ts
export type Search[Entity]sFilters = {
  q?: string;
  // Additional filters specific to entity
};

export type Search[Entity]sDataArgs = {
  dbClient: DbClient;
  limit?: number;
  page?: number;
  sortBy?: keyof [Entity];
  orderBy?: 'asc' | 'desc';
  includeArchived?: boolean;
  filters?: Search[Entity]sFilters;
};

export async function search[Entity]sData({
  dbClient,
  limit = 25,
  page = 1,
  sortBy = 'created_at',
  orderBy = 'desc',
  includeArchived = false,
  filters,
}: Search[Entity]sDataArgs) {
  let baseQuery = dbClient.selectFrom('[entity_table]');

  if (!includeArchived) {
    baseQuery = baseQuery.where('deleted_at', 'is', null);
  }

  // Add filter conditions
  if (filters?.q) {
    baseQuery = baseQuery.where(eb =>
      eb.or([
        eb('email', 'ilike', `%${filters.q}%`),
        // Additional fields to search
      ])
    );
  }

  const records = await baseQuery
    .selectAll()
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(sortBy, orderBy)
    .execute();

  const allRecords = await baseQuery
    .select(eb => eb.fn.count('id').as('total_records'))
    .executeTakeFirst();

  return transformToPaginatedResponse({
    records,
    totalRecords: Number(allRecords?.total_records) ?? 0,
    limit,
    page,
  });
}

export type Search[Entity]sDataResponse = Awaited<ReturnType<typeof search[Entity]sData>>;
```

## Response Types
Always export a response type derived from the function's return type:

```typescript
export type [Operation][Entity]DataResponse = Awaited<ReturnType<typeof [operation][Entity]Data>>;
```

## Error Handling
- Use `executeTakeFirstOrThrow` with a custom error for operations that might not find a record
- Use the `NotFoundError` class for consistent error handling
- Return typed responses for better integration with the service and controller layers 