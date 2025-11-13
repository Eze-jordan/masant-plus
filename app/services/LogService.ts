// app/Services/LogService.ts
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()} → ${message}`
})

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new DailyRotateFile({
      dirname: 'logs',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '14d',
      level: 'info',
    }),
    new DailyRotateFile({
      dirname: 'logs',
      filename: 'errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '30d',
      level: 'error',
    }),
    new winston.transports.Console(),
  ],
})

export default class LogService {
  static info(message: string) {
    logger.info(message)
  }

  static warn(message: string) {
    logger.warn(message)
  }

  static error(message: string) {
    logger.error(message)
  }

  static action(userId: number | string | null, action: string, meta?: Record<string, any>) {
    const user = userId ? `USER:${userId}` : 'GUEST'
    const metaStr = meta ? ` | meta: ${JSON.stringify(meta)}` : ''
    logger.info(`${user} → ${action}${metaStr}`)
  }
}
