import { mockDbClient } from '@/db/__test-utils__/mock-db-client';
import { BadRequestError } from '@/utils/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loginAuthService } from './login';

const mockDependencies = {
  getAccountData: vi.fn(),
  createSessionData: vi.fn(),
  revokeSessionData: vi.fn(),
  compareTextToHashedText: vi.fn(),
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn(),
};

const mockExistingAccount = {
  id: '123',
  email: 'test@example.com',
  password: 'hashedPassword123',
};

const mockSession = {
  id: 'session123',
  refresh_token: 'refreshToken123',
  account_id: '123',
};

describe('loginAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully login and return tokens', async () => {
    const payload = {
      email: 'test@example.com',
      password: 'correctPassword',
    };

    mockDependencies.getAccountData.mockResolvedValue(mockExistingAccount);
    mockDependencies.compareTextToHashedText.mockReturnValue(true);
    mockDependencies.generateRefreshToken.mockReturnValue('refreshToken123');
    mockDependencies.createSessionData.mockResolvedValue(mockSession);
    mockDependencies.generateAccessToken.mockReturnValue('accessToken123');

    const result = await loginAuthService({
      dbClient: mockDbClient.dbClientTransaction,
      payload,
      dependencies: mockDependencies,
    });

    expect(result).toEqual({ accessToken: 'accessToken123' });

    expect(mockDependencies.getAccountData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      email: payload.email,
    });

    expect(mockDependencies.revokeSessionData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      accountId: mockExistingAccount.id,
    });

    expect(mockDependencies.generateAccessToken).toHaveBeenCalledWith({
      payload: {
        sessionId: mockSession.id,
        accountId: mockExistingAccount.id,
        email: mockExistingAccount.email,
      },
      options: { expiresIn: '1d', issuer: 'login', audience: 'frontend' },
    });
  });

  it('should throw BadRequestError when account does not exist', async () => {
    const payload = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    mockDependencies.getAccountData.mockResolvedValue(null);

    await expect(
      loginAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new BadRequestError('Account does not exist.'));
  });

  it('should throw BadRequestError when password is incorrect', async () => {
    const payload = {
      email: 'test@example.com',
      password: 'wrongPassword',
    };

    mockDependencies.getAccountData.mockResolvedValue(mockExistingAccount);
    mockDependencies.compareTextToHashedText.mockReturnValue(false);

    await expect(
      loginAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new BadRequestError('Password is incorrect.'));
  });
});
