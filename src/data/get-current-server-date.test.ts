import { createTestDbClient } from '@/db/create-db-client';
import { formatDateToISO } from '@/utils/date';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { getCurrentServerDateData } from './get-current-server-date';

const dbClient = createTestDbClient();

describe('getCurrentServerDateData', () => {
  it('should return the valid current server date', async () => {
    const currentServerDateData = await getCurrentServerDateData({ dbClient });

    const validDate = z.union([z.coerce.date(), z.string()]).parse(currentServerDateData);

    expect(formatDateToISO(validDate)).toBe(currentServerDateData);
  });
});
