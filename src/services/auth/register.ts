import { createAccountData } from '@/data/accounts/create-account';
import { getAccountData } from '@/data/accounts/get-account';
import { createUserData } from '@/data/users/create-user';
import { type DbClient } from '@/db/create-db-client';
import { UserRoleType } from '@/db/types';
import { hashText } from '@/lib/bcrypt';
import { BadRequestError } from '@/utils/errors';

export type RegisterAuthServiceDependencies = {
  getAccountData: typeof getAccountData;
  createAccountData: typeof createAccountData;
  createUserData: typeof createUserData;
  hashText: typeof hashText;
};

export type RegisterAuthServiceArgs = {
  dbClient: DbClient;
  payload: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: UserRoleType;
  };
  dependencies?: RegisterAuthServiceDependencies;
};

export async function registerAuthService({
  dbClient,
  payload,
  dependencies = {
    getAccountData,
    createAccountData,
    createUserData,
    hashText,
  },
}: RegisterAuthServiceArgs) {
  await dbClient.transaction().execute(async dbClientTrx => {
    const existingAccount = await dependencies.getAccountData({
      dbClient: dbClientTrx,
      email: payload.email,
    });

    if (existingAccount) {
      throw new BadRequestError('Account already exists.');
    }

    const hashedPassword = dependencies.hashText({ text: payload.password });

    const createdAccount = await dependencies.createAccountData({
      dbClient: dbClientTrx,
      values: {
        email: payload.email,
        password: hashedPassword,
      },
    });

    await dependencies.createUserData({
      dbClient: dbClientTrx,
      values: {
        id: createdAccount.id,
        email: createdAccount.email,
        first_name: payload.firstName ?? null,
        last_name: payload.lastName ?? null,
        role: payload.role ?? UserRoleType.USER,
      },
    });
  });
}
