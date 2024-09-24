import { envConfig } from '@/env';
import { runApplyDbMigration } from './commands/run-apply-db-migration';
import { cliLogger } from './utils/logger';

function run() {
  const dbUrl = envConfig.DB_URL;
  const testDbUrl = envConfig.TEST_DB_URL;

  cliLogger.info(`Running migration on CORE database with STAGE of ${envConfig.STAGE}...`);
  runApplyDbMigration({ databaseUrl: dbUrl });

  cliLogger.info(`Running migration on TEST database with STAGE of ${envConfig.STAGE}...`);
  runApplyDbMigration({ databaseUrl: testDbUrl });
}

run();
