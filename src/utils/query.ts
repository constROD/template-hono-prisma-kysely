export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(item => {
        searchParams.append(key, String(item));
      });
    } else if (typeof value === 'object') {
      searchParams.append(key, JSON.stringify(value));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export function appendQueryToUrl(baseUrl: string, params: Record<string, unknown>): string {
  const queryString = buildQueryString(params);
  return `${baseUrl}${queryString}`;
}

export function parseQueryString(queryString: string): Record<string, string | string[]> {
  const searchParams = new URLSearchParams(queryString);
  const result: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    const allValues = searchParams.getAll(key);
    result[key] = allValues.length > 1 ? allValues : value;
  });

  return result;
}

export function parseStringBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}
