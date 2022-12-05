import express from 'express';
import { Route } from './core/interfaces';
import { errorMiddleware } from '../src/core/middlewares/index';
import hpp from 'hpp';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { Logger } from '../src/core/utils';

const app: express.Application = express();
const port: string | number = process.env.PORT || 3000;
const production: boolean = process.env.NODE_ENV == 'production' ? true : false;
const feURL: string = process.env.FE_URL || '';

const App = (routes: Route[]): void => {
  connectToDatabase();
  initializeMiddleware();
  initializeRoutes(routes);
  initializeErrorMiddleware();
};

const connectToDatabase = (): void => {
  const connectString = process.env.MONGODB_URI;
  if (!connectString) {
    Logger.error('Connection string is invalid');
    return;
  }
  mongoose.connect(connectString).catch((reason) => {
    Logger.error(reason);
    process.exit();
  });
  Logger.info('Database connected...');
};

const initializeRoutes = (routes: Route[]): void => {
  routes.forEach((route) => {
    app.use('/', route.router);
  });
  // app.use('*', (req, res, next) => res.redirect('/'));
};

const initializeMiddleware = (): void => {
  if (production) {
    app.use(hpp());
    app.use(helmet());
    app.use(morgan('combined'));
    app.use(cors({ origin: feURL, credentials: true }));
  } else {
    app.use(morgan('dev'));
    app.use(cors({ origin: true, credentials: true }));
  }
  app.use(express.json({ limit: '300kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(errorMiddleware);
};

const RateLimit = (path: string): void => {
  const status = 429;
  const BLOCK_SECOND: number = 1 * 60 * 1000; //1 minute
  const MAX_REQUEST = 5;
  app.use(path,
    rateLimit({
      windowMs: BLOCK_SECOND,
      max: MAX_REQUEST,
      statusCode: status,
      message: { error: { message: '(#1) Page request limit reached', type: 'OauthException', code: status } }
    })
  );
};

const initializeErrorMiddleware = (): void => {
  app.use(errorMiddleware);
};

const listen = (): void => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};

export { App, listen, RateLimit };
