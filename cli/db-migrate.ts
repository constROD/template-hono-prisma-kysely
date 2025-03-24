import { envConfig } from '@/env';
import { runApplyDbMigration } from './commands/run-apply-db-migration';
import { cliLogger } from './utils/logger';
import { parseArguments } from './utils/parse-arguments';

const args = parseArguments(process.argv);

const db = args.get('db') as 'core' | 'test' | undefined;

function run() {
  const dbUrl = envConfig.DB_URL;
  const testDbUrl = envConfig.TEST_DB_URL;

  if (!db) {
    cliLogger.info(`Running migration on CORE database with STAGE of ${envConfig.STAGE}...`);
    runApplyDbMigration({ databaseUrl: dbUrl });

    cliLogger.info(`Running migration on TEST database with STAGE of ${envConfig.STAGE}...`);
    runApplyDbMigration({ databaseUrl: testDbUrl });
  }

  if (db === 'core') {
    cliLogger.info(`Running migration on CORE database with STAGE of ${envConfig.STAGE}...`);
    runApplyDbMigration({ databaseUrl: dbUrl });
  }

  if (db === 'test') {
    cliLogger.info(`Running migration on TEST database with STAGE of ${envConfig.STAGE}...`);
    runApplyDbMigration({ databaseUrl: testDbUrl });
  }
}

run();
