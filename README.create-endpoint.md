# Create Endpoint

## Understanding the Layers

####  Database Layer
- `prisma` - for prisma schema and migrations.
- `src/db` - for database connection and schemas.
  - `src/db/schema.ts` - for database schema types. (**NOTE: This is where we define the source of truth for database schema types and** )
  - `src/db/types.ts` - for database types. (**NOTE: This is automatically generated by `prisma-kysely`** )

#### Data Access Layer
- `src/data` - for data access layer. (e.g. `api`, `database`, `cache`, etc.)
  - `src/data/*/schema.ts` - for specific resource data access zod schema and types that matched with database schema types.
  - `src/data/schema.ts` - root schema file that contains all schema of all resources.
  
#### Service Layer
- `src/services` - for business logic and orchestration of data access layer.

#### Controller/Route Layer
- `src/controllers` - for api routes and handlers.
  - `src/controllers/*/routes.ts` - for specific resource api routes and handlers.
  - `src/controllers/routes.ts` - root routes file that contains all routes of all resources.

#### App Layer
- `src/app.ts` - for app initialization and configuration.

## Prerequisites

Please see the [Project Workflow Patterns](README.project-structure.md#project-workflow-patterns) first before creating an endpoint.

## Creating new endpoint

1. Create a model in `prisma/schema.prisma`
2. Run `pnpm db:dev` to generate the database migration and apply it to the database and generate the database types.
3. Once no. 2 is done, you'll see the new model types in `src/db/types.ts`.
4. Now create the database types in `src/db/schema.ts` and override the new model types in `src/db/types.ts` that has `Generated` type. Please see the JSDoc comment for more details in `src/db/schema.ts`. (**NOTE: This is where we define the source of truth for database schema types and types.**)
5. Create the data access schema for the new resource/model in `src/data/<resource-name>/schema.ts` and create `src/data/*/__test-utils__/make-fake-<resource-name>.ts` for the new resource.
6. Create the data access for the new resource in `src/data/<resource-name>/<get|create|update|delete|etc>.ts`.
7. Create the service if necessary in `src/services/<any-service-file-or-folder-name>`.
8. Create the controller for the new resource in `src/controllers/<resource-name>/<get|create|update|delete|etc>.ts`.
9. Create the controller routes for the new resource in `src/controllers/<resource-name>/routes.ts`.
10. Add the new resource routes to the root routes file in `src/controllers/routes.ts`.
11. That's it!