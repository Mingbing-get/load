//将所有的reducer都组合到一个根上面
import { combineReducers } from 'redux';
import testReducer from './testReducer.js';
import routerReducer from './routerReducer.js';
import loginReducer from './loginReducer.js';

export default combineReducers({testReducer, routerReducer, loginReducer});