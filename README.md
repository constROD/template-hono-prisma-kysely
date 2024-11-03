# Template Hono Prisma Kysely with SST v2 by bossROD

## Description

This is a robust template for serverless backend development using **Node.js**, **SST (Serverless Stack)**, **Hono**, **Prisma**, and **Kysely**. It leverages **AWS Lambda** and **API Gateway** for scalable API deployment. The project includes **ESLint**, **Prettier**, **Husky**, and **lint-staged** for code quality and consistency. It also features **Vitest** for testing, **Swagger** and **Scalar** for API documentation, and **Docker** for local database management. The template is set up with **TypeScript** for type safety and uses **pnpm** as the package manager.

## Rules

Please read the repo **Code Standards** here [README.code-standards.md](./README.code-standards.md)

## Clone

```bash
npx degit https://github.com/constROD/template-hono-prisma-kysely.git#with-sst-v2
```

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
pnpm dev --stage=<stage> // e.g. pnpm dev --stage=bossrod
```

**Production Mode:**

- Start the build for production.
```bash
pnpm deploy --stage=<stage> // e.g. pnpm deploy --stage=dev | pnpm deploy --stage=prod
```
