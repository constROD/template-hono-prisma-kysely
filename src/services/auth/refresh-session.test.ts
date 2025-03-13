import { mockDbClient } from '@/db/__test-utils__/mock-db-client';
import { UnauthorizedError } from '@/utils/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { refreshSessionAuthService } from './refresh-session';

const mockDependencies = {
  getSessionData: vi.fn(),
  revokeSessionData: vi.fn(),
  updateSessionData: vi.fn(),
  getUserData: vi.fn(),
  verifyRefreshToken: vi.fn(),
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn(),
};

const mockRefreshTokenPayload = {
  accountId: 'account123',
};

const mockSession = {
  id: 'session123',
  refresh_token: 'refreshToken123',
  account_id: 'account123',
};

const mockUser = {
  id: 'account123',
  email: 'test@example.com',
};

describe('refreshSessionAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully refresh the session', async () => {
    const payload = {
      refreshToken: 'refreshToken123',
    };

    mockDependencies.verifyRefreshToken.mockReturnValue(mockRefreshTokenPayload);
    mockDependencies.getSessionData.mockResolvedValue(mockSession);
    mockDependencies.generateRefreshToken.mockReturnValue('newRefreshToken');
    mockDependencies.updateSessionData.mockResolvedValue({
      ...mockSession,
      refresh_token: 'newRefreshToken',
    });
    mockDependencies.getUserData.mockResolvedValue(mockUser);
    mockDependencies.generateAccessToken.mockReturnValue('newAccessToken');

    const result = await refreshSessionAuthService({
      dbClient: mockDbClient.dbClientTransaction,
      payload,
      dependencies: mockDependencies,
    });

    expect(result).toEqual({
      user: mockUser,
      sessionId: mockSession.id,
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    });

    expect(mockDependencies.verifyRefreshToken).toHaveBeenCalledWith(payload.refreshToken);
    expect(mockDependencies.getSessionData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      accountId: mockRefreshTokenPayload.accountId,
    });
    expect(mockDependencies.generateRefreshToken).toHaveBeenCalledWith({
      payload: { accountId: mockSession.account_id },
      options: { expiresIn: '30d' },
    });
    expect(mockDependencies.updateSessionData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      id: mockSession.id,
      values: { refresh_token: 'newRefreshToken' },
    });
    expect(mockDependencies.getUserData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      id: mockRefreshTokenPayload.accountId,
    });
    expect(mockDependencies.generateAccessToken).toHaveBeenCalledWith({
      payload: {
        sessionId: mockSession.id,
        accountId: mockUser.id,
        email: mockUser.email,
      },
      options: { expiresIn: '5m', issuer: 'refresh', audience: 'frontend' },
    });
  });

  it('should throw UnauthorizedError when refresh token is expired', async () => {
    const payload = {
      refreshToken: 'expiredRefreshToken',
    };

    mockDependencies.verifyRefreshToken.mockReturnValue(null);

    await expect(
      refreshSessionAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new UnauthorizedError('Refresh token is expired.'));
  });

  it('should throw UnauthorizedError when refresh token is invalid', async () => {
    const payload = {
      refreshToken: 'invalidRefreshToken',
    };

    mockDependencies.verifyRefreshToken.mockReturnValue(mockRefreshTokenPayload);
    mockDependencies.getSessionData.mockResolvedValue({
      ...mockSession,
      refresh_token: 'differentRefreshToken',
    });

    await expect(
      refreshSessionAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new UnauthorizedError('Refresh token is invalid.'));
  });
});
