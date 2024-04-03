import { execSync } from 'child_process';

export function runCommand(command: string) {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (error) {
    return { error };
  }
  return { error: null };
}

export function runCommandWithOutput(command: string) {
  try {
    const output = execSync(command, { encoding: 'utf-8' }); // Ensure the output is a string
    const lines = output.split('\n').filter(line => line.trim() !== ''); // Split by newline and filter out empty lines
    return { data: lines, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
