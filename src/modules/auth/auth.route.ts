import { Router } from 'express';
import { Route } from '@core/interfaces';
const AuthRoute = (path: string): Route => {
    let router = Router();
    router.post(path, )
    return {path, router}
}