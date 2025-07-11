# Template Hono Prisma Kysely by bossROD

## Description

This is an opinionated, robust template for backend development either for serverless or non-serverless using **Node.js** or **SST (Serverless Stack)** with **Hono**, **Prisma**, and **Kysely**. The project includes **ESLint**, **Prettier**, **Husky**, and **lint-staged** for code quality and consistency. It also features **Vitest** for testing, **Swagger** and **Scalar** for API documentation, and **Docker** for local database management. The template is set up with **TypeScript** for type safety and uses **pnpm** as the package manager.

## Rules

- Please read the repo's **Project Structure & Code Organization** here [README.project-structure.md](./README.project-structure.md)
- For the coding standards, please read the rules in this folder [rules](./rules)

## Clone

Choose the approach that best fits your needs:

### 1. Standalone Hono Server

Branch: [main](https://github.com/constROD/template-hono-prisma-kysely)
For a basic setup using just the Hono server:

```bash
npx degit constROD/template-hono-prisma-kysely
```

### 2. With SST v2 (AWS Provider)

Branch: [with-sst-v2](https://github.com/constROD/template-hono-prisma-kysely/tree/with-sst-v2)
For a setup integrated with Serverless Stack (SST) v2 - AWS Provider:

```bash
npx degit constROD/template-hono-prisma-kysely#with-sst-v2
```

### 3. With Wrangler (Cloudflare Provider)

Branch: [with-cloudflare](https://github.com/constROD/template-hono-prisma-kysely/tree/with-wrangler)
For a setup integrated with Wrangler - Cloudflare Provider:

```bash
npx degit constROD/template-hono-prisma-kysely#with-cloudflare
```

### 4. With JWT Auth

Branch: [with-jwt-auth](https://github.com/constROD/template-hono-prisma-kysely/tree/with-jwt-auth)
For a setup with JWT authentication:

```bash
npx degit constROD/template-hono-prisma-kysely#with-jwt-auth
```

Choose the command that corresponds to your preferred API layer approach.

## Prerequisites

- Download extension [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) in your VSCode.
- Install [node](https://nodejs.org/en) using [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) (check version in [.nvmrc](./.nvmrc))
- Install [pnpm](https://pnpm.io/) (check version in [package.json](./package.json) file look for `packageManager`)
- Install [Docker](https://www.docker.com/) for database containerization.


## Installation

- Install dependencies.

```bash
pnpm i
```

**Development Mode:**

- Start the database container.
```bash
pnpm db:start
```

- Stop the database container.
```bash
pnpm db:stop
```

- Start the development server.
```bash
pnpm dev
```

**Production Mode:**

- Build the project.
```bash
pnpm build
```

- Start the build for production.
```bash
pnpm start
```