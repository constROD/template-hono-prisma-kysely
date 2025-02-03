# Project Structure & Code Organization

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
  - `controllers/*/dto` - for specific resource request/response DTOs.
  - `controllers/*/routes.ts` - contains all routes of specific resource.
  - `controllers/routes.ts` - root routes file that contains all routes of all resources.
- `data` - for data access layer. (e.g. `api`, `database`, `cache`, etc.)
  - `data/*/schema.ts` - for data access layer schema.
  - `data/schema.ts` - root schema file that contains all schema of all resources.
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
  - `aws/functions/api` - for all aws lambda functions that are related to api.
  - `aws/functions/cron` - for all aws lambda functions that are related to cron jobs.
  - `aws/functions/queues` - for all aws lambda functions that are related to queues.
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
- `src/services` - for shared business logic and orchestration of data access layer.
- `src/types` - for shared types.
- `src/utils` - for shared utilities.
  
### Features Domain (Optional)
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

## Project Workflow Patterns

- **Pattern 1:** For simple application.
  ```mermaid
  graph LR
    subgraph "Pattern 1"
        direction LR
        DAL1[Data Access Layer]:::dataStyle --> CL1[Controller Layer]:::controllerStyle
        CL1 --> AWS1[AWS Infrastructure Layer]:::infraStyle
        AWS1 --> APP1[App]:::appStyle
    end

    %% Styles
    classDef dataStyle fill:#e1f5fe,stroke:#0277bd
    classDef serviceStyle fill:#fce4ec,stroke:#c2185b
    classDef controllerStyle fill:#e8f5e9,stroke:#2e7d32
    classDef infraStyle fill:#fff3e0,stroke:#ef6c00
    classDef appStyle fill:#f3e5f5,stroke:#7b1fa2
  ```

- **Pattern 2:** For complex application with strict business logic.
  ```mermaid
  graph LR
    subgraph "Pattern 2"
        direction LR
        DAL2[Data Access Layer]:::dataStyle --> SL[Service Layer]:::serviceStyle
        SL --> CL2[Controller Layer]:::controllerStyle
        CL2 --> AWS2[AWS Infrastructure Layer]:::infraStyle
        AWS2 --> APP2[App]:::appStyle
    end

    %% Styles
    classDef dataStyle fill:#e1f5fe,stroke:#0277bd
    classDef serviceStyle fill:#fce4ec,stroke:#c2185b
    classDef controllerStyle fill:#e8f5e9,stroke:#2e7d32
    classDef infraStyle fill:#fff3e0,stroke:#ef6c00
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
          CL3 --> AWS3[AWS Infrastructure Layer]:::infraStyle
          AWS3 --> APP3[App]:::appStyle
      end

      %% Styles
      classDef dataStyle fill:#e1f5fe,stroke:#0277bd
      classDef serviceStyle fill:#fce4ec,stroke:#c2185b
      classDef controllerStyle fill:#e8f5e9,stroke:#2e7d32
      classDef infraStyle fill:#fff3e0,stroke:#ef6c00
      classDef appStyle fill:#f3e5f5,stroke:#7b1fa2
  ```


