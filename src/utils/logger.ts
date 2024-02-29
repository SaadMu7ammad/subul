import winston from 'winston';

const myFormat = winston.format.printf(({ level, message }) => {
    return `[${level}] ${message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        myFormat,
    ),
    transports: [new winston.transports.Console()],
});

export default logger;
