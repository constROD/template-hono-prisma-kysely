import { getEnvConfig } from '@/env';
import { runApplyDbMigration } from './commands/run-apply-db-migration';
import { cliLogger } from './utils/logger';
import { parseArguments } from './utils/parse-arguments';

const args = parseArguments(process.argv);

const dbArg = args.get('db') as 'core' | 'test' | undefined;

function run() {
  const envConfig = getEnvConfig();

  const dbUrl = envConfig.DB_MIGRATION_URL;
  const testDbUrl = envConfig.TEST_DB_MIGRATION_URL;

  if (!dbArg) {
    cliLogger.info(`Running migration on CORE database with STAGE of ${envConfig.STAGE}...`);
    runApplyDbMigration({ databaseUrl: dbUrl });

    cliLogger.info(`Running migration on TEST database with STAGE of ${envConfig.STAGE}...`);
    runApplyDbMigration({ databaseUrl: testDbUrl });
  }

  if (dbArg === 'core') {
    cliLogger.info(`Running migration on CORE database with STAGE of ${envConfig.STAGE}...`);
    runApplyDbMigration({ databaseUrl: dbUrl });
  }

  if (dbArg === 'test') {
    cliLogger.info(`Running migration on TEST database with STAGE of ${envConfig.STAGE}...`);
    runApplyDbMigration({ databaseUrl: testDbUrl });
  }
}

run();
