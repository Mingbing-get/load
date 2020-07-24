import { TEST } from '../action/allConstValue.js';

function raddTsxt(state = '', action) {
    switch (action.type) {
        case TEST :
            return state+action.text;
        default : return state;
    }
}

export default raddTsxt
