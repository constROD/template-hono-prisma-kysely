import { formatDateToISO } from '@/utils/date';
import { describe, expect } from 'vitest';
import { z } from 'zod';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { getServerDateTimeData } from './get-server-date-time';

describe('getServerDateTimeData', () => {
  testWithDbClient('should return the valid server date time', async ({ dbClient }) => {
    const serverDateTimeData = await getServerDateTimeData({ dbClient });

    const validDate = z.union([z.coerce.date(), z.string()]).parse(serverDateTimeData);

    expect(formatDateToISO(validDate)).toBe(serverDateTimeData);
  });
});
