import { NextFunction, Request, Response } from 'express';

class IndexController {
  index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).send('API is running....');
    } catch (error) {
      next(error);
    }
  };
}

export default new IndexController();
