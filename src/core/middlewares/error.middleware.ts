import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@core/exceptions';
import { Logger } from '../utils';

import http from 'http';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction): void => {
  const status: number = error.status || 500;
  const message = error.message || 'Some thing when wrong';
  Logger.error(`[ERROR][${req.ip}] - Status: ${status} - Message: ${message}`);
  res.status(status).json({ code: status, message: message });
};

export default errorMiddleware;
