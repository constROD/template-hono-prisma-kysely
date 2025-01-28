# Standards

## Naming conventions
- `kebab-case` - for all folders/files.
- `_kebab-case` - for feature domain's specific common modules.
- `PascalCase` - for classes and types.
- `snake_case` - for database tables, columns, query, params and request body.
- `camelCase` - for functions, zod schemas and etc.

## Miscellaneous Folders
- `.husky` - for husky configuration.
- `databases` - for database container volume.
- `cli` - for cli automation scripts. (e.g. seeders, migrations, etc.)
- `prisma` - for prisma schema and migrations.

## Common Modules
- `constants` - for constant values.
- `controllers` - for api routes and handlers.
  - `controllers/dto` - for api request/response DTOs.
  - `controllers/*/routes.ts` - contains all routes of specific resource.
  - `controllers/routes.ts` - contains all routes of all resources.
- `data` - for data access layer. (e.g. `api`, `database`, `cache`, etc.)
- `db` - for database connection and schemas.
- `lib` - for 3rd party integrations libraries.
- `middlewares` - for middlewares.
- `services` - for business logic and orchestration of data access layer.
- `types` - for types.
- `utils` - for utilities.

## File(s)
- `src/env.ts` - for environment variables.

## AWS Folder Structure
- `aws` - main aws folder.
- `aws/functions` - for all aws lambda functions.
- `aws/stacks` - for all aws cloudformation stacks.

## Domain Folders
- `src` - main source code and shared common modules.
- `src/features` - main features folder. **(Only if necessary)**

### Shared Modules
- `src/constants` - for shared constants module.
- `src/data` - for shared data access layer module. (e.g. `api`, `database`).
- `src/db` - for shared database connection and schemas.
- `src/lib` - for shared 3rd party integrations libraries.
- `src/middlewares` - for shared middlewares.
- `src/services` - for shared business logic and orchestration of data access layer. **(Only if necessary)**
- `src/types` - for shared types.
- `src/utils` - for shared utilities.
  
### Features Domain
- `src/features/<feature-name>` - for feature.
  - `src/features/<feature-name>/_constants` - for feature's constants.
  - `src/features/<feature-name>/_controllers` - for feature's controllers.
  - `src/features/<feature-name>/_data` - for feature's data access layer.
  - `src/features/<feature-name>/_db` - for feature's database connection and schemas. **(Only if necessary)**
  - `src/features/<feature-name>/_lib` - for feature's 3rd party integrations libraries. **(Only if necessary)**
  - `src/features/<feature-name>/_middlewares` - for feature's middlewares. **(Only if necessary)**
  - `src/features/<feature-name>/_services` - for feature's business logic and orchestration of data access layer. **(Only if necessary)**
  - `src/features/<feature-name>/_types` - for feature's types.
  - `src/features/<feature-name>/_utils` - for feature's utilities.

## How it works?

- **Pattern 1** (For simple CRUD apps)
  ```
  Data Access Layer -> Controller Layer -> App
  ```
- **Pattern 2** (For complex apps with business logic)
  ```
  Data Access Layer -> Service Layer -> Controller Layer -> App
  ```
- **Pattern 3 (Hybrid)** (Combination of Pattern 1 and Pattern 2) 
  ```
  Data Access Layer -> Controller Layer -> App
  Data Access Layer -> Service Layer -> Controller Layer -> App
  ```

