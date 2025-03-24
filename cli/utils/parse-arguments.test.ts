import { describe, expect, it } from 'vitest';
import { parseArguments } from './parse-arguments';

describe(parseArguments.name, () => {
  it('should correctly parse valid arguments', () => {
    const args = ['--key1=value1', '--key2=value2'];
    const expected = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]);
    expect(parseArguments(args)).toEqual(expected);
  });

  it('should ignore invalid arguments', () => {
    const args = ['--key1', 'notAKey=value', '--=value3'];
    const expected = new Map();
    expect(parseArguments(args)).toEqual(expected);
  });

  it('should parse valid arguments and ignore invalid ones', () => {
    const args = ['--key1=value1', 'notAKey=value', '--key2=value2', '--=value3'];
    const expected = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]);
    expect(parseArguments(args)).toEqual(expected);
  });

  it('should return an empty map for an empty array', () => {
    const args: string[] = [];
    const expected = new Map();
    expect(parseArguments(args)).toEqual(expected);
  });

  it('should ignore arguments without an equals sign', () => {
    const args = ['--key1', '--key2=value2'];
    const expected = new Map([['key2', 'value2']]);
    expect(parseArguments(args)).toEqual(expected);
  });
});
