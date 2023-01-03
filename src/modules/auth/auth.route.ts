import { Router } from 'express';
import { Route } from '@core/interfaces';
import authController from './auth.controller';
import authMiddleware from './../../core/middlewares/auth.middleware';
const AuthRoute = (): Route => {
  const u = (path: string): string => process.env.PREFIX_API + '/auth' + path;
  let router = Router();

  router.post(u(``), authController.login); //login
  router.post(u(`/refresh-token`), authController.refreshToken); //refresh token
  router.post(u(`/revoke-token`), authMiddleware, authController.revokeToken);
  router.get(u(``), authMiddleware, authController.getCurrentLoginUser);
  return { router };
};
export default AuthRoute;
