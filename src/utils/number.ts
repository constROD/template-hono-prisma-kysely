export function isValidStringDecimalNumber(value: string) {
  if (value.split('.').length > 2) return false;
  const parsedNumber = parseFloat(value);
  return !isNaN(parsedNumber);
}
