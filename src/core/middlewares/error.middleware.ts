import { NextFunction, Request, Response } from "express";
import { HttpException } from '@core/exceptions';
import { Logger } from '../utils';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction): void => {
    const status: number = error.status || 500;
    const message = error.message || 'Some thing when wrong';
    Logger.error(`[ERROR] - Status: ${status} - Message: ${message}`);
    res.status(status).json({ message: message });
}

export default errorMiddleware;