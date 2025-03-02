# Project Structure & Code Organization

## Package Manager
- Use `pnpm` for all package installations and management

## Core Libraries and Versions
- Hono: ^4.x.x
- TypeScript: ^5.x.x
- Prisma: ^5.x.x
- Kysely: ^0.27.x
- Zod: ^3.x.x
- Swagger/OpenAPI: Using @hono/swagger-ui and @hono/zod-openapi
- Node Server: @hono/node-server
- Dayjs: ^1.x.x
- Pino: ^9.x.x (for logging)
- Docker: For containerization and PostgreSQL database

## Naming Conventions
- `kebab-case` - for all folders/files
- `_kebab-case` - for feature domain's specific common modules
- `PascalCase` - for classes and types
- `snake_case` - for database tables, columns, query, params and request body
- `camelCase` - for functions, zod schemas and etc.

## Miscellaneous Folders
- `.husky` - for husky configuration
- `volumes` - for docker container volume
- `cli` - for cli automation scripts (e.g. seeders, migrations, etc.)
- `prisma` - for prisma schema and migrations

## Common Modules
- `constants` - for constant values
- `controllers` - for api routes and handlers
  - `controllers/*/dto` - for specific resource request/response DTOs
  - `controllers/*/routes.ts` - contains all routes of specific resource
  - `controllers/routes.ts` - root routes file that contains all routes of all resources
- `data` - for data access layer (e.g. `api`, `database`, `cache`, etc.)
  - `data/*/schema.ts` - for data access layer schema
  - `data/schema.ts` - root schema file that contains all schema of all resources
- `db` - for database connection and schemas
- `lib` - for 3rd party integrations libraries
- `middlewares` - for middlewares
- `services` - for business logic and orchestration of data access layer **(Only if necessary)**
- `types` - for types
- `utils` - for utilities
  
## Domain Folders
- `src` - main source code and shared common modules
- `src/features` - main features folder **(Only if necessary)**

## Files
- `src/app.ts` - main entry point
- `src/env.ts` - for environment variables

## Shared Modules Structure
Shared modules follow this structure:

```
src/
├── constants/              # Shared constants module
├── controllers/            # API routes and handlers
│   ├── */dto/              # Resource-specific DTOs
│   ├── */routes.ts         # Resource-specific routes
│   └── routes.ts           # Root routes file
├── data/                   # Shared data access layer module (API, database, cache)
│   ├── */schema.ts         # Resource-specific schemas
│   └── schema.ts           # Root schema file
├── db/                     # Database connections and configuration
├── lib/                    # Shared 3rd party integrations
├── middlewares/            # API middlewares
├── services/               # Shared business logic (only if necessary)
├── types/                  # Shared types
└── utils/                  # Shared utilities
```

## Feature Domain Structure (Optional)
When creating new feature files, follow this structure:

```
src/features/<feature-name>/
├── index.ts                # Feature's entry point
├── _constants/             # Feature's constants
├── _controllers/           # Feature's controllers
│   ├── dto/                # Feature's DTOs
│   └── routes.ts           # Feature's routes
├── _data/                  # Feature's data access layer
│   └── schema.ts           # Feature's schemas
├── _db/                    # Feature's database connection and schemas (only if necessary)
├── _lib/                   # Feature's 3rd party integrations libraries (only if necessary)
├── _middlewares/           # Feature's middlewares (only if necessary)
├── _services/              # Feature's business logic (only if necessary)
├── _types/                 # Feature's types
└── _utils/                 # Feature's utilities
```

## Project Workflow Patterns

- **Pattern 1:** For simple application.
  ```mermaid
  graph LR
    subgraph "Pattern 1"
        direction LR
        DAL1[Data Access Layer]:::dataStyle --> CL1[Controller Layer]:::controllerStyle
        CL1 --> APP1[App]:::appStyle
    end

    %% Styles
    classDef dataStyle fill:#e1f5fe,stroke:#0277bd
    classDef serviceStyle fill:#fce4ec,stroke:#c2185b
    classDef controllerStyle fill:#e8f5e9,stroke:#2e7d32
    classDef appStyle fill:#f3e5f5,stroke:#7b1fa2
  ```

- **Pattern 2:** For complex application with strict business logic.
  ```mermaid
  graph LR
    subgraph "Pattern 2"
        direction LR
        DAL2[Data Access Layer]:::dataStyle --> SL[Service Layer]:::serviceStyle
        SL --> CL2[Controller Layer]:::controllerStyle
        CL2 --> APP2[App]:::appStyle
    end

    %% Styles
    classDef dataStyle fill:#e1f5fe,stroke:#0277bd
    classDef serviceStyle fill:#fce4ec,stroke:#c2185b
    classDef controllerStyle fill:#e8f5e9,stroke:#2e7d32
    classDef appStyle fill:#f3e5f5,stroke:#7b1fa2
  ```
- **Pattern 3:** For either simple or complex applications. (**NOTE: This is a more flexible pattern compared to patterns 1 and 2, as sometimes you only need to call the Data Access Layer directly when there's no complex business logic involved, eliminating the need for a Service Layer.**)
  ```mermaid
  graph LR
      subgraph "Pattern 3"
          direction LR
          DAL3[Data Access Layer]:::dataStyle --> CL3[Controller Layer]:::controllerStyle
          DAL3 --> SL3[Service Layer]:::serviceStyle
          SL3 --> CL3
          CL3 --> APP3[App]:::appStyle
      end

      %% Styles
      classDef dataStyle fill:#e1f5fe,stroke:#0277bd
      classDef serviceStyle fill:#fce4ec,stroke:#c2185b
      classDef controllerStyle fill:#e8f5e9,stroke:#2e7d32
      classDef appStyle fill:#f3e5f5,stroke:#7b1fa2
  ```
