import winston from "winston";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

const colors = {
    error: "green",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white"
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
        (info) => `${info.timestamp}[${info.level}]: ${info.message}`
    )
);

const transports = [
    new winston.transports.Console({
        format: winston.format.colorize({ all: true })
    })
]

const Logger = winston.createLogger({
    levels,
    format,
    transports
});

export default Logger