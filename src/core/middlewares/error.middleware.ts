<<<<<<< HEAD
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@core/exceptions';
import { Logger } from '../utils';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction): void => {
=======
import { Request, Response } from 'express';
import { HttpException } from '@core/exceptions';
import { Logger } from '../utils';

const errorMiddleware = (error: HttpException, req: Request, res: Response): void => {
>>>>>>> d02f48cb9967a0e130abf314858ca88e90add3e0
  const status: number = error.status || 500;
  const message = error.message || 'Some thing when wrong';
  Logger.error(`[ERROR] - Status: ${status} - Message: ${message}`);
  res.status(status).json({ code: status, message: message });
};

export default errorMiddleware;
