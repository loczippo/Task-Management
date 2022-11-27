import express, { NextFunction, Request, Response } from 'express'
import { Route } from './core/interfaces';

const app: express.Application = express();
const port: string | number = process.env.PORT || 3000;

const App = (routes: Route[]) => {
    initializeRoutes(routes);
}

const initializeRoutes = (routes: Route[]) => {
    routes.forEach((route) => {
        app.use('/', route.router)
    })
}

const listen = (): void => {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    })
}

export  {App, listen};