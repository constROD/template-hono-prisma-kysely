export function parseArguments(args: string[]) {
  const argsMap = new Map<string, string>();
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      if (key && value) argsMap.set(key, value);
    }
  });
  return argsMap;
}
