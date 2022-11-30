const dotenv = require('dotenv');
dotenv.config();

import { IndexRoute } from './modules/index';
<<<<<<< HEAD
import { UserRoute } from './modules/users'
import { App, listen } from './app';

const routes = [
    IndexRoute(),
    UserRoute()
];

App(routes);
listen();
=======
import { App, listen } from './app';

const prefix = '/api';

const routes = [IndexRoute(`/`)];

App(routes);
listen();
>>>>>>> d02f48cb9967a0e130abf314858ca88e90add3e0
