import IndexController from './index.controler';
import { Router } from 'express';
import { Route } from '@core/interfaces';
import { RateLimit } from '../../app';
import IRateLimit from '@core/interfaces/rate_limit.interface';

/**
 * @category General Use
 */

const indexRoute = (): Route => {
  const u = (path: string): string => process.env.PREFIX_API + path;
  
  // const props: IRateLimit = {path: path, maxRequest: 2, minutes: 1};
  // RateLimit(props);

  const router = Router();
  router.get(u(`/`), IndexController.index);
  
  return { router };
};

export default indexRoute;
