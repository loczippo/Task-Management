import IndexController from './index.controler';
import { Router } from 'express';
import { Route } from '@core/interfaces';
import { RateLimit } from '../../app';
import IRateLimit from '@core/interfaces/rate_limit.interface';

/**
 * @category General Use
 */

const indexRoute = (): Route => {
  const path = process.env.PREFIX_API + '/';
  
  // const props: IRateLimit = {path: path, maxRequest: 2, minutes: 1};
  // RateLimit(props);

  const router = Router();
  router.get(path, IndexController.index);
  return { path, router };
};

export default indexRoute;
