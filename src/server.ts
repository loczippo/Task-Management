const dotenv = require('dotenv');
dotenv.config();

import { IndexRoute } from './modules/index';
import { App, listen } from './app';

const prefix = '/api';

const routes = [IndexRoute(`/`)];

App(routes);
listen();
