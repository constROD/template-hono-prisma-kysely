import { BadRequestError } from '@/utils/errors';

export type MakeDefaultDataListReturnArgs<TRecords> = {
  records: TRecords[];
  totalRecords: number;
  limit: number;
  page: number;
};

export function makeDefaultDataListReturn<TRecords>({
  records,
  totalRecords,
  limit,
  page,
}: MakeDefaultDataListReturnArgs<TRecords>) {
  if (limit <= 0 || page <= 0) throw new BadRequestError('Limit and page must be greater than 0');

  const totalPages = Math.ceil(totalRecords / limit);

  return {
    records,
    total_records: totalRecords,
    total_pages: totalPages,
    current_page: page,
    next_page: page < totalPages ? page + 1 : null,
    previous_page: page > 1 ? page - 1 : null,
  };
}
