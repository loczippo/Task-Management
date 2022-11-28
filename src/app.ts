import express, { NextFunction, Request, Response } from 'express'
import { Route } from './core/interfaces';
import { errorMiddleware } from '../src/core/middlewares/index'
import hpp from 'hpp';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app: express.Application = express();
const port: string | number = process.env.PORT || 3000;
const production:boolean = process.env.NODE_ENV == 'production' ? true : false;
const feURL:string = process.env.FE_URL || '';

const App = (routes: Route[]): void => {
    initializeMiddleware();
    initializeRoutes(routes);
    initializeErrorMiddleware();
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

    let TOO_MANY_REQUEST: number = 429;
    let BLOCK_SECOND = 1 * 60 * 1000; //1 minute
    let MAX_REQUEST = 5;
    app.use(rateLimit({
        windowMs: BLOCK_SECOND,
        max: MAX_REQUEST,
        statusCode: TOO_MANY_REQUEST,
        message: {code: TOO_MANY_REQUEST, message: "TOO MANY REQUESTS"},
    }));

    app.use(express.json({ limit: '300kb' }));
    app.use(express.urlencoded({ extended: true }));
}

const initializeErrorMiddleware = (): void => {
    app.use(errorMiddleware);
}

const listen = (): void => {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    })
}

export  {App, listen};