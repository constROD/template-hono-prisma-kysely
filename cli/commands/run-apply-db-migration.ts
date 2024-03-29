import { customLog } from 'cli/utils/logger';
import { runCommand } from '../utils/run-command';

export function runApplyDbMigration(databaseUrl: string) {
  process.env.DB_URL = databaseUrl;

  const migrateCommand = 'pnpm prisma migrate dev';
  const { error: migrateError } = runCommand(migrateCommand);

  if (migrateError) {
    customLog.error(`Error when running prisma migrate:\n`, migrateError);
    process.exit();
  }

  const generateCommand = 'pnpm prisma generate';
  const { error: generateError } = runCommand(generateCommand);

  if (generateError) {
    customLog.error(`Error when running prisma generate:\n`, generateError);
    process.exit();
  }
}
