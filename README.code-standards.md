# Standards

## Naming conventions

- `kebab-case` - for all folders/files.
- `PascalCase` - for classes and types.
- `snake_case` - for database tables, columns, query, params and request body.
- `camelCase` - for functions, zod schemas and etc.

## Miscellaneous Folder(s)

- `.husky` - for husky configuration.
- `databases` - for database container volume.
- `cli` - for cli automation scripts. (e.g. seeders, migrations, etc.)
- `prisma` - for prisma schema and migrations.

## Folder Structure

- `src` - main source code.
- `src/constants` - for constant values.
- `src/controllers` - for api routes and handlers.
- `src/data` - for data access layer. (e.g. database, cache, etc.)
- `src/db` - for database connection and schemas.
- `src/lib` - for 3rd party integrations libraries.
- `src/middlewares` - for app middlewares.
- `src/services` - for business logic and orchestration of data access layer.
- `src/utils` - for helpers and utilities.
- `src/types` - for shared types and interfaces.

## File(s)

- `src/app.ts` - main entry point.
- `src/env.ts` - for environment variables.

## How it works?

- **Pattern 1** (For simple CRUD apps)
  - Data Access Layer -> Controller -> App
- **Pattern 2** (For complex apps with business logic)
  - Data Access Layer -> Service -> Controller -> App
- **Pattern 3** (Hybrid of Pattern 1 and Pattern 2)
  - Combined
    - Data Access Layer -> Controller -> App
    - Data Access Layer -> Service -> Controller -> App