import 'dotenv/config';

import { IndexRoute } from './modules/index';
import {App, listen} from './app'

const routes = [IndexRoute()];

App(routes);
listen();


