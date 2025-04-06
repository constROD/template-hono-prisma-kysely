import { mockDbClient } from '@/db/__test-utils__/mock-db-client';
import { mockSession } from '@/middlewares/__test-utils__/openapi-hono';
import { BadRequestError } from '@/utils/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { changePasswordAuthService } from './change-password';

const mockDependencies = {
  getAccountData: vi.fn(),
  updateAccountData: vi.fn(),
  hashText: vi.fn(),
  compareTextToHashedText: vi.fn(),
};

const mockExistingAccount = {
  id: '123',
  email: 'test@example.com',
  password: 'hashedPassword123',
};

describe('changePasswordAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully change password', async () => {
    const payload = {
      session: mockSession,
      currentPassword: 'currentPassword',
      newPassword: 'newPassword',
    };

    mockDependencies.getAccountData.mockResolvedValue(mockExistingAccount);
    mockDependencies.compareTextToHashedText.mockReturnValue(true);
    mockDependencies.hashText.mockReturnValue('newHashedPassword');
    mockDependencies.updateAccountData.mockResolvedValue({ ...mockExistingAccount });

    await changePasswordAuthService({
      dbClient: mockDbClient.dbClientTransaction,
      payload,
      dependencies: mockDependencies,
    });

    expect(mockDependencies.getAccountData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      id: payload.session.accountId,
    });

    expect(mockDependencies.compareTextToHashedText).toHaveBeenCalledWith({
      text: payload.currentPassword,
      hashedText: mockExistingAccount.password,
    });

    expect(mockDependencies.hashText).toHaveBeenCalledWith({
      text: payload.newPassword,
    });

    expect(mockDependencies.updateAccountData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      id: mockExistingAccount.id,
      values: {
        password: 'newHashedPassword',
      },
    });
  });

  it('should throw BadRequestError when account is not found', async () => {
    const payload = {
      session: { ...mockSession, id: 'nonexistent' },
      currentPassword: 'currentPassword',
      newPassword: 'newPassword',
    };

    mockDependencies.getAccountData.mockResolvedValue(null);

    await expect(
      changePasswordAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new BadRequestError('Account not found.'));

    expect(mockDependencies.updateAccountData).not.toHaveBeenCalled();
    expect(mockDependencies.hashText).not.toHaveBeenCalled();
  });

  it('should throw BadRequestError when current password is incorrect', async () => {
    const payload = {
      session: mockSession,
      currentPassword: 'wrongPassword',
      newPassword: 'newPassword',
    };

    mockDependencies.getAccountData.mockResolvedValue(mockExistingAccount);
    mockDependencies.compareTextToHashedText.mockReturnValue(false);

    await expect(
      changePasswordAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new BadRequestError('Current password is incorrect.'));

    expect(mockDependencies.updateAccountData).not.toHaveBeenCalled();
    expect(mockDependencies.hashText).not.toHaveBeenCalled();
  });
});
