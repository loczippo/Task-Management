import { Router } from 'express';
import { Route } from '@core/interfaces';
import authController from './auth.controller';
const AuthRoute = (): Route => {
    let path = process.env.PREFIX_API + '/auth';
    let router = Router();
    router.post(path, authController.login)
    return {path, router}
}
export default AuthRoute