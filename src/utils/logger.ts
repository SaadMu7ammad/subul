import winston from 'winston';

const myFormat = winston.format.printf(({ level, message }) => {
  return `[${level}] ${message}`;
});

const transports = [];

if (process.env.NODE_ENV === 'test') {
  transports.push(new winston.transports.Console({ silent: true }));
} else {
  transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.colorize(), myFormat),
  transports,
});

export default logger;
