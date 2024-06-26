# Standards

## Naming conventions

- `kebab-case` - for all folders/files.
- `PascalCase` - for classes and types.
- `snake_case` - for database tables and columns.
- `camelCase` - for functions, zod schemas and etc.

## Miscellaneous Folder(s)

- `/.husky` - for husky configuration.
- `/databases` - for database container volume.
- `/cli` - for cli automation scripts. (e.g. seeders, migrations, etc.)
- `/prisma` - for prisma schema and migrations.

## Folder Structure

- `/src` - main source code.
- `/src/controllers` - for api routes and handlers.
- `/src/data` - for data access layer. (e.g. database, cache, etc.)
- `/src/db` - for database connection and schemas.
- `/src/lib` - for 3rd party integrations libraries.
- `/src/middlewares` - for express middlewares.
- `/src/utils` - for helpers and utilities.
- `/src/types` - for shared types and interfaces.

## File(s)

- `/src/app.ts` - main entry point.
- `/src/env.ts` - for environment variables.
- `/src/constants.ts` - for constant values. (make this a folder if it's too many)