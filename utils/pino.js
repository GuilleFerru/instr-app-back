import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
    prettyPrint: { colorize: true }
})

export const consoleLogger = pino(
    {
        level: 'info',
    },
    pino.destination('./utils/logs/info.log'),
    stream
);

export const errorLogger = pino(
    pino.destination(
        {
            dest: 'error.log',
        },
    ),
);

export const warningLogger = pino(
    pino.destination(
        {
            dest: 'warn.log',
        },
    ),
);



