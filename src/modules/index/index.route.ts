import IndexController from './index.controler';
import { Router } from 'express';
import { Route } from '@core/interfaces';

const indexRoute = (): Route => {
  const path = process.env.PREFIX_API + '/';
  const router = Router();
  router.get(path, IndexController.index);
  return { path, router };
};

export default indexRoute;
