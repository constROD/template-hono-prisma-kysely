import { describe, expect, it } from 'vitest';
import {
  transformToPaginatedResponse,
  type TransformToPaginatedResponseArgs,
} from './transform-to-paginated-response';

describe('transformToPaginatedResponse', () => {
  it('should return correct values for a single page of results', () => {
    const input: TransformToPaginatedResponseArgs<string> = {
      records: ['a', 'b', 'c'],
      totalRecords: 3,
      limit: 10,
      page: 1,
    };

    const result = transformToPaginatedResponse(input);

    expect(result).toEqual({
      records: ['a', 'b', 'c'],
      total_records: 3,
      total_pages: 1,
      current_page: 1,
      next_page: null,
      previous_page: null,
    });
  });

  it('should handle multiple pages correctly', () => {
    const input: TransformToPaginatedResponseArgs<number> = {
      records: [1, 2, 3, 4, 5],
      totalRecords: 15,
      limit: 5,
      page: 2,
    };

    const result = transformToPaginatedResponse(input);

    expect(result).toEqual({
      records: [1, 2, 3, 4, 5],
      total_records: 15,
      total_pages: 3,
      current_page: 2,
      next_page: 3,
      previous_page: 1,
    });
  });

  it('should handle the last page correctly', () => {
    const input: TransformToPaginatedResponseArgs<number> = {
      records: [11, 12],
      totalRecords: 12,
      limit: 5,
      page: 3,
    };

    const result = transformToPaginatedResponse(input);

    expect(result).toEqual({
      records: [11, 12],
      total_records: 12,
      total_pages: 3,
      current_page: 3,
      next_page: null,
      previous_page: 2,
    });
  });

  it('should handle empty records', () => {
    const input: TransformToPaginatedResponseArgs<unknown> = {
      records: [],
      totalRecords: 0,
      limit: 10,
      page: 1,
    };

    const result = transformToPaginatedResponse(input);

    expect(result).toEqual({
      records: [],
      total_records: 0,
      total_pages: 0,
      current_page: 1,
      next_page: null,
      previous_page: null,
    });
  });

  it('should throw an error if limit is less than 1', () => {
    const input: TransformToPaginatedResponseArgs<number> = {
      records: [],
      totalRecords: 0,
      limit: 0,
      page: 1,
    };

    expect(() => transformToPaginatedResponse(input)).toThrow(
      'Limit and page must be greater than 0'
    );
  });

  it('should throw an error if page is less than 1', () => {
    const input: TransformToPaginatedResponseArgs<number> = {
      records: [],
      totalRecords: 0,
      limit: 10,
      page: 0,
    };

    expect(() => transformToPaginatedResponse(input)).toThrow(
      'Limit and page must be greater than 0'
    );
  });
});
