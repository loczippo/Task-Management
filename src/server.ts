const dotenv = require('dotenv');
dotenv.config();

import { IndexRoute } from './modules/index';
import { UserRoute } from './modules/users'
import { AuthRoute } from './modules/auth';
import { App, listen } from './app';

const routes = [
    IndexRoute(),
    UserRoute(),
    AuthRoute()
];

App(routes);
listen();
