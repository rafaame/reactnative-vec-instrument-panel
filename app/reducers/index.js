import { combineReducers } from 'redux';

import * as dashboardReducers from './dashboard';

export default combineReducers(Object.assign(
    dashboardReducers
));
