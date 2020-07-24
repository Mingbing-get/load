import { ROUTERURL } from '../action/allConstValue.js';

function changeTest(state = '', action) {
    switch (action.type) {
        case ROUTERURL :
            return action.text;
        default : return state;
    }
}

export default changeTest
