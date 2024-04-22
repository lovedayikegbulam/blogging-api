import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const devLogger = () => {
  return createLogger({
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    transports: [new transports.Console()],
  });
};

const prodLogger = () => {
  return createLogger({
    level: "info",
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
    transports: [
      new transports.Console({
        level: 'info', 
      }),
      // new transports.File({
      //   filename: 'logs/error.log',
      //   level: 'error', 
      // }),
      // new transports.File({ filename: 'logs/combined.log' }),
    ],
  });
};


let logger = null;


if (process.env.NODE_ENV !== 'production') {
  logger = devLogger;
}else{
  logger = prodLogger;
}

export default logger();
