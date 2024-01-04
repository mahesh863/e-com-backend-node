import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const devLogger = () => {
  return createLogger({
    level: 'debug',
    format: combine(format.colorize(), timestamp({ format: 'HH:mm:ss' }), myFormat),
    transports: [new transports.Console()],
  });
};

export default devLogger;
