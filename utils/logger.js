const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
        format.errors({ stack: true }),
        format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message || info.stack}`)),
    transports: [
        new transports.File({
            maxSize: 5 * 1024000,
            maxFiles: 5,
            filename: `${__dirname}/../logs/activity.log`,
        }),
        new transports.Console({
            level: 'debug',
        })
    ]
})