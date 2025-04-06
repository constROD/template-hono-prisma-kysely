import { getAccountData } from '@/data/accounts/get-account';
import { updateAccountData } from '@/data/accounts/update-account';
import { type DbClient } from '@/db/create-db-client';
import { compareTextToHashedText, hashText } from '@/lib/bcrypt';
import { type Session } from '@/types/auth';
import { BadRequestError } from '@/utils/errors';

export type ChangePasswordAuthServiceDependencies = {
  getAccountData: typeof getAccountData;
  updateAccountData: typeof updateAccountData;
  hashText: typeof hashText;
  compareTextToHashedText: typeof compareTextToHashedText;
};

export type ChangePasswordAuthServiceArgs = {
  dbClient: DbClient;
  payload: {
    session: Session;
    currentPassword: string;
    newPassword: string;
  };
  dependencies?: ChangePasswordAuthServiceDependencies;
};

export async function changePasswordAuthService({
  dbClient,
  payload,
  dependencies = {
    getAccountData,
    updateAccountData,
    hashText,
    compareTextToHashedText,
  },
}: ChangePasswordAuthServiceArgs) {
  await dbClient.transaction().execute(async dbClientTrx => {
    const existingAccount = await dependencies.getAccountData({
      dbClient: dbClientTrx,
      id: payload.session.accountId,
    });

    if (!existingAccount) {
      throw new BadRequestError('Account not found.');
    }

    const isCurrentPasswordValid = dependencies.compareTextToHashedText({
      text: payload.currentPassword,
      hashedText: existingAccount.password,
    });

    if (!isCurrentPasswordValid) {
      throw new BadRequestError('Current password is incorrect.');
    }

    const hashedNewPassword = dependencies.hashText({ text: payload.newPassword });

    await dependencies.updateAccountData({
      dbClient: dbClientTrx,
      id: existingAccount.id,
      values: {
        password: hashedNewPassword,
      },
    });
  });
}

export type ChangePasswordAuthServiceResponse = Awaited<
  ReturnType<typeof changePasswordAuthService>
>;
