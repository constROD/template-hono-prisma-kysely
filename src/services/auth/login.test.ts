import { mockDbClient } from '@/db/__test-utils__/mock-db-client';
import { BadRequestError } from '@/utils/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loginAuthService } from './login';

const mockDependencies = {
  getAccountData: vi.fn(),
  createSessionData: vi.fn(),
  revokeSessionData: vi.fn(),
  compareTextToHashedText: vi.fn(),
  generateJWT: vi.fn(),
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
    mockDependencies.generateJWT.mockReturnValueOnce('refreshToken123');
    mockDependencies.createSessionData.mockResolvedValue(mockSession);
    mockDependencies.generateJWT.mockReturnValueOnce('accessToken123');

    const result = await loginAuthService({
      dbClient: mockDbClient.dbClientTransaction,
      payload,
      dependencies: mockDependencies,
    });

    expect(result).toEqual({
      accessToken: 'accessToken123',
      refreshToken: 'refreshToken123',
    });

    expect(mockDependencies.getAccountData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      email: payload.email,
    });

    expect(mockDependencies.compareTextToHashedText).toHaveBeenCalledWith({
      text: payload.password,
      hashedText: mockExistingAccount.password,
    });

    expect(mockDependencies.revokeSessionData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      accountId: mockExistingAccount.id,
    });

    // Check first generateJWT call for refresh token
    expect(mockDependencies.generateJWT).toHaveBeenNthCalledWith(1, {
      payload: {
        accountId: mockExistingAccount.id,
        sub: mockExistingAccount.id,
        iss: 'login',
        aud: 'frontend',
      },
      secretOrPrivateKey: expect.any(String),
      signOptions: { expiresIn: '30d' },
    });

    expect(mockDependencies.createSessionData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      values: { refresh_token: 'refreshToken123', account_id: mockExistingAccount.id },
    });

    // Check second generateJWT call for access token
    expect(mockDependencies.generateJWT).toHaveBeenNthCalledWith(2, {
      payload: {
        email: mockExistingAccount.email,
        accountId: mockExistingAccount.id,
        sessionId: mockSession.id,
        sub: mockExistingAccount.id,
        iss: 'login',
        aud: 'frontend',
      },
      secretOrPrivateKey: expect.any(String),
      signOptions: { expiresIn: '5m' },
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

    expect(mockDependencies.getAccountData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      email: payload.email,
    });

    expect(mockDependencies.compareTextToHashedText).not.toHaveBeenCalled();
    expect(mockDependencies.revokeSessionData).not.toHaveBeenCalled();
    expect(mockDependencies.generateJWT).not.toHaveBeenCalled();
    expect(mockDependencies.createSessionData).not.toHaveBeenCalled();
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
    ).rejects.toThrow(new BadRequestError('Invalid credentials.'));

    expect(mockDependencies.getAccountData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      email: payload.email,
    });

    expect(mockDependencies.compareTextToHashedText).toHaveBeenCalledWith({
      text: payload.password,
      hashedText: mockExistingAccount.password,
    });

    expect(mockDependencies.revokeSessionData).not.toHaveBeenCalled();
    expect(mockDependencies.generateJWT).not.toHaveBeenCalled();
    expect(mockDependencies.createSessionData).not.toHaveBeenCalled();
  });
});
