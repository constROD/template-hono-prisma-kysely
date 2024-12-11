export function overrideValueOrUseDefault<TValue, TDefault>(value: TValue, defaultValue: TDefault) {
  return value === undefined ? defaultValue : value;
}
