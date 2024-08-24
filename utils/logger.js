import log4js from 'log4js'

log4js.configure({
    appenders: {
        miLoggerConsole: { type: 'console', filename: './utils/logs/info.log' },
        miLoggerFileWarn: { type: 'file', filename: './utils/logs/warn.log' },
        miLoggerFileError: { type: 'console', filename: './utils/logs/error.log' }
    },
    categories: {
        default: { appenders: ["miLoggerConsole"], level: "trace" },
        info: { appenders: ["miLoggerConsole"], level: "info" },
        warn: { appenders: ["miLoggerFileWarn"], level: "warn" },
        error: { appenders: ["miLoggerFileError"], level: "error" }
    }
});

export const loggerInfo = log4js.getLogger('info');
export const loggerWarn = log4js.getLogger('warn');
export const loggerError = log4js.getLogger('error');