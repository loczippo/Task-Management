import express, { NextFunction, Request, Response } from 'express'
import { Route } from './core/interfaces';
import hpp from 'hpp';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

const app: express.Application = express();
const port: string | number = process.env.PORT || 3000;
const production = process.env.NODE_ENV == 'production' ? true : false;
const feURL = process.env.FE_URL;

const App = (routes: Route[]): void => {
    initializeRoutes(routes);
    initializeMiddleware();
}

const initializeRoutes = (routes: Route[]): void => {
    routes.forEach((route) => {
        app.use('/', route.router)
    })
}

const initializeMiddleware = (): void => {
    if(production) {
        app.use(hpp());
        app.use(helmet());
        app.use(morgan('combined'));
        app.use(cors({ origin: feURL, credentials: true }));
    } else {
        app.use(morgan('dev'));
        app.use(cors({ origin: true, credentials: true }));
    }
}

const listen = (): void => {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    })
}

export  {App, listen};