import dayjs from 'dayjs';

export function getCurrentLocalDateISO() {
  return dayjs().toISOString();
}

export function formatDateToISO(date: string | Date) {
  return dayjs(date).toISOString();
}
