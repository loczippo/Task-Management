const dotenv = require('dotenv');
dotenv.config();

import { IndexRoute } from './modules/index';
import { UserRoute } from './modules/users'
import { App, listen } from './app';

const routes = [
    IndexRoute(),
    UserRoute()
];

App(routes);
listen();
