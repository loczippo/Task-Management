import IndexController from './index.controler';
import { Router } from 'express';
import { Route } from '@core/interfaces';

<<<<<<< HEAD
const indexRoute = (): Route => {
  const path = process.env.PREFIX_API + '/';
  const router = Router();
  router.get(path, IndexController.index);
  return { path, router };
};

export default indexRoute;
=======
const IndexRoute = (path: string): Route => {
  const router = Router();
  router.get(path, IndexController);
  return { path, router };
};

export default IndexRoute;
>>>>>>> d02f48cb9967a0e130abf314858ca88e90add3e0
