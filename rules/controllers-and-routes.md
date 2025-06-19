---
description: Guidelines for Controllers and Routes
globs: 
alwaysApply: false
---
# Guidelines for Controllers and Routes

## Purpose & Overview
These rules define the standard patterns for implementing API controllers and routes. The guidelines are based on the implementation of the 'users' module and should be followed for all controller and route implementations to maintain consistency across the codebase.

## File Structure

### Shared Domain

By default, place all controller files in the shared controller directory. Only use feature domains when explicitly specified in requirements.

```
src/controllers/[resource-name]/
├── routes.ts               # Resource routes configuration
├── create-[resource].ts    # Create operation
├── get-[resource].ts       # Get single resource
├── get-[resource]s.ts      # Get multiple resources
├── update-[resource].ts    # Update operation
├── delete-[resource].ts    # Delete operation
├── archive-[resource].ts   # Archive operation (soft delete)
├── unarchive-[resource].ts # Unarchive operation
├── search-[resource]s.ts   # Search with filters
└── dto/                    # Data Transfer Objects (if needed)
```

## Naming Conventions

### Function Naming
- `[operation][Resource]Route`: For route configuration
- `[operation][Resource]RouteHandler`: For route handlers

### Type Naming
- `[Operation][Resource]Params`: Type for request parameters
- `[Operation][Resource]Query`: Type for query parameters
- `[Operation][Resource]Body`: Type for request body
- `[Operation][Resource]Response`: Type for response body

## Implementation Patterns

### Route Configuration
Each resource-specific controller should have a separate routes.ts file that imports and registers all route handlers:

```typescript
// routes.ts
import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { create[Resource]Route, create[Resource]RouteHandler } from './create-[resource]';
import { get[Resource]Route, get[Resource]RouteHandler } from './get-[resource]';
// Import other route handlers...

const [resource]Routes = new OpenAPIHono<HonoEnv>()
  .openapi(create[Resource]Route, create[Resource]RouteHandler)
  .openapi(get[Resource]Route, get[Resource]RouteHandler)
  // Register other routes...

export default [resource]Routes;
```

### Root Routes File
All resource routes should be imported and registered in the main routes.ts file:

```typescript
// src/controllers/routes.ts
import [resource1]Routes from './[resource1]/routes';
import [resource2]Routes from './[resource2]/routes';
// Import other resource routes...

export const routes = [
  [resource1]Routes,
  [resource2]Routes,
  // Add other resource routes...
] as const;

export type AppRoutes = (typeof routes)[number];
```

### Controller Implementation

Each controller file should follow this pattern:

```typescript
// [operation]-[resource].ts
import { [operation][Resource]Data } from '@/data/[resource]/[operation]-[resource]';
// OR import from service layer if business logic is needed
// import { [operation][Resource] } from '@/services/[resource]/[operation]-[resource]';
import { [resource]SchemaOpenApi } from '@/data/[resource]/schema';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, z } from '@hono/zod-openapi';

// Define schemas for request/response
export const [operation][Resource]Schema = {
  // May include params, query, body schemas as needed
  params: z.object({
    // Define params if needed
  }),
  query: z.object({
    // Define query params if needed  
  }),
  body: z.object({
    // Define body schema if needed
  }),
  response: [resource]SchemaOpenApi,
};

// Export type definitions
export type [Operation][Resource]Params = z.infer<typeof [operation][Resource]Schema.params>;
export type [Operation][Resource]Query = z.infer<typeof [operation][Resource]Schema.query>;
export type [Operation][Resource]Body = z.infer<typeof [operation][Resource]Schema.body>;
export type [Operation][Resource]Response = z.infer<typeof [operation][Resource]Schema.response>;

// Define OpenAPI route
export const [operation][Resource]Route = createRoute({
  middleware: [], // Add middleware if needed
  security: [{ bearerAuth: [] }], // Add security if needed
  method: 'get', // HTTP method: 'get', 'post', 'put', 'patch', 'delete'
  path: '/[resources]/{id}', // Route path
  tags: ['[Resources]'], // OpenAPI tags
  summary: '[Operation] a [resource]',
  description: '[Operation] a [resource] description.',
  request: {
    params: [operation][Resource]Schema.params, // Include if needed
    query: [operation][Resource]Schema.query, // Include if needed
    body: { // Include if needed
      content: {
        'application/json': {
          schema: [operation][Resource]Schema.body,
        },
      },
    },
  },
  responses: {
    200: { // Or appropriate status code
      content: {
        'application/json': {
          schema: [operation][Resource]Schema.response,
        },
      },
      description: '[Resource] [operation] successfully',
    },
  },
});

// Define route handler
export const [operation][Resource]RouteHandler: AppRouteHandler<typeof [operation][Resource]Route> = async c => {
  const dbClient = c.get('dbClient');
  
  // Get parameters from request (if needed)
  const params = c.req.valid('param');
  const query = c.req.valid('query');
  const body = c.req.valid('json');

  // Call data access or service layer
  const result = await [operation][Resource]Data({ 
    dbClient, 
    // Include other parameters as needed
  });

  // Return response with appropriate status code
  return c.json(result, { status: 200 }); // Adjust status code as needed
};
```

## Controller Types and Patterns

### Create Controller
```typescript
// create-[resource].ts
export const create[Resource]Schema = {
  body: [resource]Schema.pick({
    // Pick only fields that are required for creation
  }),
  response: [resource]SchemaOpenApi,
};

export const create[Resource]Route = createRoute({
  method: 'post',
  path: '/[resources]',
  // ...
});

export const create[Resource]RouteHandler: AppRouteHandler<typeof create[Resource]Route> = async c => {
  // ...
  return c.json(result, { status: 201 });
};
```

### Get Single Resource Controller
```typescript
// get-[resource].ts
export const get[Resource]Schema = {
  params: z.object({
    [resource]_id: z.string().uuid(),
  }),
  response: [resource]SchemaOpenApi,
};

export const get[Resource]Route = createRoute({
  method: 'get',
  path: '/[resources]/{[resource]_id}',
  // ...
});
```

### Get Multiple Resources Controller
```typescript
// get-[resource]s.ts
export const get[Resource]sSchema = {
  query: z.object({
    limit: z.string().optional(),
    page: z.string().optional(),
    sort_by: z.string().optional(),
    order_by: z.enum(['asc', 'desc']).optional(),
  }),
  response: z.object({
    records: z.array([resource]SchemaOpenApi),
    total_records: z.number(),
    limit: z.number(),
    page: z.number(),
  }),
};

export const get[Resource]sRoute = createRoute({
  method: 'get',
  path: '/[resources]',
  // ...
});
```

### Update Controller
```typescript
// update-[resource].ts
export const update[Resource]Schema = {
  params: z.object({
    [resource]_id: z.string().uuid(),
  }),
  body: [resource]Schema.partial().omit({
    // Omit fields that cannot be updated
    id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
  }),
  response: [resource]SchemaOpenApi,
};

export const update[Resource]Route = createRoute({
  method: 'put', // or 'patch' for partial updates
  path: '/[resources]/{[resource]_id}',
  // ...
});
```

### Delete Controller
```typescript
// delete-[resource].ts
export const delete[Resource]Schema = {
  params: z.object({
    [resource]_id: z.string().uuid(),
  }),
  response: [resource]SchemaOpenApi,
};

export const delete[Resource]Route = createRoute({
  method: 'delete',
  path: '/[resources]/{[resource]_id}',
  // ...
});
```

### Archive Controller (Soft Delete)
```typescript
// archive-[resource].ts
export const archive[Resource]Schema = {
  params: z.object({
    [resource]_id: z.string().uuid(),
  }),
  response: [resource]SchemaOpenApi,
};

export const archive[Resource]Route = createRoute({
  method: 'delete',
  path: '/[resources]/{[resource]_id}/archive',
  // ...
});

export const archive[Resource]RouteHandler: AppRouteHandler<typeof archive[Resource]Route> = async c => {
  // ...
  const archived[Resource] = await update[Resource]Data({
    dbClient,
    id: params.[resource]_id,
    values: { deleted_at: sql`NOW()` as unknown as Date },
  });
  // ...
};
```

### Unarchive Controller
```typescript
// unarchive-[resource].ts
export const unarchive[Resource]Schema = {
  params: z.object({
    [resource]_id: z.string().uuid(),
  }),
  response: [resource]SchemaOpenApi,
};

export const unarchive[Resource]Route = createRoute({
  method: 'post',
  path: '/[resources]/{[resource]_id}/unarchive',
  // ...
});

export const unarchive[Resource]RouteHandler: AppRouteHandler<typeof unarchive[Resource]Route> = async c => {
  // ...
  const unarchived[Resource] = await update[Resource]Data({
    dbClient,
    id: params.[resource]_id,
    values: { deleted_at: null },
  });
  // ...
};
```

### Search Controller
```typescript
// search-[resource]s.ts
export const search[Resource]sSchema = {
  query: z.object({
    search_text: z.string().optional(),
    limit: z.string().optional(),
    page: z.string().optional(),
    sort_by: z.string().optional(),
    order_by: z.enum(['asc', 'desc']).optional(),
    include_archived: z.enum(['true', 'false']).optional(),
    // Additional filter fields specific to resource
  }),
  response: z.object({
    records: z.array([resource]SchemaOpenApi),
    total_records: z.number(),
    limit: z.number(),
    page: z.number(),
  }),
};

export const search[Resource]sRoute = createRoute({
  method: 'get',
  path: '/[resources]/search',
  // ...
});
```

## Workflow Patterns

Controllers should follow one of the three workflow patterns from the project structure guidelines:

### Pattern 1: Simple Application (Direct Data Access)
```typescript
// For simple operations with no complex business logic
export const [operation][Resource]RouteHandler: AppRouteHandler<typeof [operation][Resource]Route> = async c => {
  const dbClient = c.get('dbClient');
  // Get request parameters
  
  // Call data access layer directly
  const result = await [operation][Resource]Data({
    dbClient,
    // Other parameters
  });
  
  return c.json(result, { status: 200 });
};
```

### Pattern 2: Complex Application (Service Layer)
```typescript
// For operations with complex business logic
export const [operation][Resource]RouteHandler: AppRouteHandler<typeof [operation][Resource]Route> = async c => {
  const dbClient = c.get('dbClient');
  // Get request parameters
  
  // Call service layer which handles business logic
  const result = await [operation][Resource]Service({
    dbClient,
    // Other parameters
  });
  
  return c.json(result, { status: 200 });
};
```

### Pattern 3: Flexible Approach
```typescript
// Choose the appropriate layer based on complexity
export const [operation][Resource]RouteHandler: AppRouteHandler<typeof [operation][Resource]Route> = async c => {
  const dbClient = c.get('dbClient');
  // Get request parameters
  
  // For simple operations, call data access layer directly
  // For complex operations, call service layer
  const result = await [operation][Resource]Data({
    // OR [operation][Resource]Service({
    dbClient,
    // Other parameters
  });
  
  return c.json(result, { status: 200 });
};
```

## Error Handling
- Use appropriate error handling in controllers
- Return proper HTTP status codes for different error scenarios
- Leverage NotFoundError and other custom error classes for consistent error handling 