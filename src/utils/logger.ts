import pino from 'pino';

const pinoConfig = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: false,
    },
  },
});

function formatLogMessage<TLogDataOrError>(message: string, data?: TLogDataOrError) {
  const logMessage = data ? `${message} ${JSON.stringify(data, null, 2)}` : message;
  return logMessage;
}

export const pinoLogger = {
  info: <TLogDataOrError>(message: string, data?: TLogDataOrError) =>
    pinoConfig.info(formatLogMessage(message, data)),
  error: <TLogDataOrError>(message: string, data?: TLogDataOrError) =>
    pinoConfig.error(formatLogMessage(message, data)),
  debug: <TLogDataOrError>(message: string, data?: TLogDataOrError) =>
    pinoConfig.debug(formatLogMessage(message, data)),
  warn: <TLogDataOrError>(message: string, data?: TLogDataOrError) =>
    pinoConfig.warn(formatLogMessage(message, data)),
};
