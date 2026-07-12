import morgan from 'morgan';
import chalk from 'chalk';
import { Request, Response } from 'express';

export const httpLogger = morgan((tokens, req: Request, res: Response) => {
    const status = Number(tokens.status(req, res));

    // 1. Colorize the HTTP Status Code based on severity
    let statusColor = chalk.green;
    if (status >= 500) statusColor = chalk.red.bold;
    else if (status >= 400) statusColor = chalk.red;
    else if (status >= 300) statusColor = chalk.yellow;

    // 2. Colorize HTTP Methods for high visibility
    const method = tokens.method(req, res);
    let methodColor = chalk.cyan;
    if (method === 'POST') methodColor = chalk.greenBright;
    if (method === 'DELETE') methodColor = chalk.redBright;
    if (method === 'PUT' || method === 'PATCH')
        methodColor = chalk.yellowBright;

    // 3. Construct a clean, scannable log string
    return [
        chalk.gray(`[${new Date().toISOString().split('T')[1].slice(0, 8)}]`),
        methodColor(method?.padEnd(6)), 
        tokens.url(req, res),
        statusColor(status),
        chalk.gray(`${tokens['response-time'](req, res)} ms`), 
        chalk.gray(`- length: ${tokens.res(req, res, 'content-length') || 0}`),
    ].join(' ');
});
