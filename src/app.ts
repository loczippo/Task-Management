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
import IMessage from '@core/interfaces/message.interface';
import IRateLimit from '@core/interfaces/rate_limit.interface';

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

const RateLimit = (props: IRateLimit): void => {
  const error: IMessage = { message: 'Application request limit reached', type: 'RequestException', code: 4 };

  app.use(props.path,
    rateLimit({
      windowMs: props.minutes * 60 * 1000,
      max: props.maxRequest,
      message: {
        error
      }
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

export { App, RateLimit, listen };
