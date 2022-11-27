import 'dotenv/config';

import { IndexRoute } from './modules/index';
import {App, listen} from './app'

let prefix = '/api'

const routes = [
    IndexRoute(`${prefix}/`),
];

App(routes);
listen();


