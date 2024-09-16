import { createTestDbClient } from '@/db/create-db-client';
import { formatDateToISO } from '@/utils/date';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { getServerDateTimeData } from './get-server-date-time';

const dbClient = createTestDbClient();

describe('getServerDateTimeData', () => {
  it('should return the valid server date time', async () => {
    const serverDateTimeData = await getServerDateTimeData({ dbClient });

    const validDate = z.union([z.coerce.date(), z.string()]).parse(serverDateTimeData);

    expect(formatDateToISO(validDate)).toBe(serverDateTimeData);
  });
});
