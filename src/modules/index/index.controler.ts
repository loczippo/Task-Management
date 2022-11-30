import { NextFunction, Request, Response } from 'express';

<<<<<<< HEAD
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
=======
function indexController(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).send('API is running....');
  } catch (error) {
    next(error);
  }
}

export default indexController;
>>>>>>> d02f48cb9967a0e130abf314858ca88e90add3e0
