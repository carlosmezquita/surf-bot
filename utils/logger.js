const { createLogger, format, transports } = require('winston');


const myFormat = format.combine(
    format.timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message || info.stack}`),
)

module.exports = createLogger({
    format: myFormat,
    transports: [
        new transports.File({
            maxSize: 5 * 1024000,
            maxFiles: 5,
            filename: `${__dirname}/../logs/activity.log`,
            handleExceptions: true,
            handleRejections: true,
            level: 'debug',
        }),
        new transports.Console({
            handleExceptions: true,
            handleRejections: true,
            level: 'info',
            format: format.combine(
                format.colorize(),
                myFormat,
            ),
        })
    ]
})
