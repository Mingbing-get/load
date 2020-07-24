import { ROUTERURL } from './allConstValue.js';

export function urlChange(text) {
    return ({
        type : ROUTERURL,
        text
    });
}