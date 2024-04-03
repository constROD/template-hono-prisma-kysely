# Template Hono Prisma Kysely API by bossROD

## Description

This is a template for backend development using **node**, **Hono**, **Prisma** and **Kysely**. It includes **ESLint**, **Prettier**, and **Husky** for code quality and linting.

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

## Rules

Please read the repo **Standards** here [README.Standards.md](./README.Standards.md)
