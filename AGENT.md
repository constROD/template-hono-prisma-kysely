# Claude AI Assistant Guidelines

## Project Context
This is a Hono + Prisma + Kysely backend project with TypeScript and PostgreSQL. When working on this codebase, you must adhere to the established conventions and patterns.

## Important Instructions

### 0. Running Tests
**ALWAYS** do `pnpm test run <file_path>` or `pnpm test run` for all.

### 1. Project Structure Compliance
**ALWAYS** follow the structure and conventions defined in `README.project-structure.md` when:
- Creating new files or folders
- Organizing code modules
- Naming files, folders, functions, types, etc.
- Implementing features or API routes

### 2. Rules and Patterns
**ALWAYS** check the `rules/` folder for specific implementation patterns before:
- Creating controllers → See `rules/controller-and-routes.md`
- Implementing data access → See `rules/data-access-via-api.md` & `rules/data-access-via-api.md`
- Creating service layers → See `rules/service-layer.md`
- Writing tests → See `rules/testing-data-access-layer.md`
- Implementing any feature that might have established patterns

### 3. Code Generation Guidelines
When generating or modifying code:
1. First, understand the existing patterns in the codebase
2. Check if there are similar implementations to reference
3. Follow the established naming conventions strictly
4. Place files in the correct folders according to the project structure
5. Use appropriate workflow patterns (Pattern 1, 2, or 3) based on complexity

### 4. Key Conventions Summary
- **File/Folder naming**: `kebab-case` (use `_kebab-case` for feature-specific modules)
- **Types/Classes**: `PascalCase`
- **Functions/Variables/Zod Schemas**: `camelCase`
- **Database**: `snake_case` for tables, columns, query params, and request body
- **Package Manager**: Always use `pnpm`
- **API Framework**: Hono
- **Database ORM**: Prisma (schema) + Kysely (queries)
- **Validation**: Zod
- **Testing**: Vitest

### 5. Before Making Changes
Always:
1. Read the relevant documentation in `README.project-structure.md`
2. Check for existing patterns in `rules/` folder
3. Look for similar implementations in the codebase
4. Maintain consistency with existing code style
5. Run all checks for TypeScript, Lint & Check Spell: `pnpm check:all`

### 6. When Creating New Features
Follow this checklist:
- [ ] Determine if it's a shared module or feature domain
- [ ] Create the appropriate folder structure as defined in the project structure
- [ ] Follow the naming conventions for all files and exports
- [ ] Check rules folder for implementation patterns
- [ ] Use existing utilities and shared modules when possible
- [ ] Only create service layers when business logic is complex
- [ ] Write type-safe code using TypeScript
- [ ] Implement proper DTOs for request/response validation
- [ ] Ensure proper error handling in data access and controllers

### 7. Checks Commands
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm format` - Format code with Prettier
- `pnpm check:all` - Run all checks concurrently for TypeScript, Lint and Check Spell

Remember: Consistency and adherence to established patterns is crucial for maintaining a clean, scalable codebase.