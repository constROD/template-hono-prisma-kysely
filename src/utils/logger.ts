/* eslint-disable no-console */

function formatLogMessage<TLogDataOrError>(message: string, data?: TLogDataOrError) {
  const timestamp = new Date().toISOString();
  const logMessage = data ? `${message} ${JSON.stringify(data, null, 2)}` : message;
  return { timestamp, message: logMessage };
}

export const logger = {
  info: <TLogDataOrError>(message: string, data?: TLogDataOrError) => {
    const { timestamp, message: logMessage } = formatLogMessage(message, data);
    console.log(`[${timestamp}] INFO:`, logMessage);
  },
  error: <TLogDataOrError>(message: string, data?: TLogDataOrError) => {
    const { timestamp, message: logMessage } = formatLogMessage(message, data);
    console.error(`[${timestamp}] ERROR:`, logMessage);
  },
  debug: <TLogDataOrError>(message: string, data?: TLogDataOrError) => {
    const { timestamp, message: logMessage } = formatLogMessage(message, data);
    console.debug(`[${timestamp}] DEBUG:`, logMessage);
  },
  warn: <TLogDataOrError>(message: string, data?: TLogDataOrError) => {
    const { timestamp, message: logMessage } = formatLogMessage(message, data);
    console.warn(`[${timestamp}] WARN:`, logMessage);
  },
};
