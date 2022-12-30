import { Router } from 'express';
import { Route } from '@core/interfaces';
import authController from './auth.controller';
import authMiddleware from './../../core/middlewares/auth.middleware';
const AuthRoute = (): Route => {
  let path = process.env.PREFIX_API + '/auth';
  let router = Router();

  router.post(path, authController.login); //login
  router.post(path + '/refresh-token', authController.refreshToken); //refresh token
  router.post(path + '/revoke-token', authMiddleware, authController.revokeToken);
  router.get(path, authMiddleware, authController.getCurrentLoginUser);
  return { path, router };
};
export default AuthRoute;
