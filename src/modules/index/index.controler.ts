import { NextFunction, Request, Response } from 'express';

function indexController(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).send('API is running....');
  } catch (error) {
    next(error);
  }
}

export default indexController;
