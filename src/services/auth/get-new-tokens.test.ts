import { mockDbClient } from '@/db/__test-utils__/mock-db-client';
import { BadRequestError } from '@/utils/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { verifySessionAuthService } from './get-new-tokens';

const mockDependencies = {
  getSessionData: vi.fn(),
  revokeSessionData: vi.fn(),
  updateSessionData: vi.fn(),
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn(),
  verifyRefreshToken: vi.fn(),
};

const mockSession = {
  id: 'session123',
  refresh_token: 'refreshToken123',
  account_id: 'account123',
  email: 'test@example.com',
};

describe('verifySessionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully verify and refresh tokens', async () => {
    const payload = {
      refreshToken: 'validRefreshToken',
    };

    mockDependencies.getSessionData.mockResolvedValue(mockSession);
    mockDependencies.verifyRefreshToken.mockReturnValue({ accountId: mockSession.account_id });
    mockDependencies.generateRefreshToken.mockReturnValue('newRefreshToken');
    mockDependencies.updateSessionData.mockResolvedValue({
      ...mockSession,
      refresh_token: 'newRefreshToken',
    });
    mockDependencies.generateAccessToken.mockReturnValue('newAccessToken');

    const result = await verifySessionAuthService({
      dbClient: mockDbClient.dbClientTransaction,
      payload,
      dependencies: mockDependencies,
    });

    expect(result).toEqual({
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    });

    expect(mockDependencies.verifyRefreshToken).toHaveBeenCalledWith(payload.refreshToken);
    expect(mockDependencies.getSessionData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      refreshToken: payload.refreshToken,
    });
    expect(mockDependencies.updateSessionData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      id: mockSession.id,
      values: { refresh_token: 'newRefreshToken' },
    });
  });

  it('should throw BadRequestError when access token is invalid', async () => {
    const payload = {
      refreshToken: 'invalidRefreshToken',
    };

    mockDependencies.verifyRefreshToken.mockReturnValue(null);

    await expect(
      verifySessionAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new BadRequestError('Invalid refresh token.'));
  });

  it('should throw BadRequestError when refresh token is invalid', async () => {
    const payload = {
      refreshToken: 'invalidRefreshToken',
    };

    mockDependencies.getSessionData.mockResolvedValue(mockSession);
    mockDependencies.verifyRefreshToken.mockReturnValue(null);

    await expect(
      verifySessionAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new BadRequestError('Invalid refresh token.'));
  });

  it('should throw BadRequestError when refresh token accountId does not match access token', async () => {
    const payload = {
      refreshToken: 'validRefreshToken',
    };

    mockDependencies.getSessionData.mockResolvedValue(mockSession);
    mockDependencies.verifyRefreshToken.mockReturnValue({ accountId: 'differentAccount' });

    await expect(
      verifySessionAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new BadRequestError('Refresh token does not match the session account.'));
  });
});
