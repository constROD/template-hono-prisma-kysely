import chalk from 'chalk';

function successLog(title: string, message: string | unknown = '') {
  const messageString = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
  console.log(chalk.green(`✔ ${title} `) + chalk.cyan(messageString));
}

function errorLog(title: string, message: string | unknown = '') {
  const messageString = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
  console.log(chalk.red(`✖ ${title} `) + chalk.cyan(messageString));
}

function infoLog(title: string, message: string | unknown = '') {
  const messageString = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
  console.log(chalk(`❯ ${title} `) + chalk.cyan(messageString));
}

export const cliLogger = {
  success: successLog,
  error: errorLog,
  info: infoLog,
};
