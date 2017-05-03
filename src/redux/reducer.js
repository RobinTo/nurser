import actionTypes from './actionTypes';
import {REHYDRATE} from 'redux-persist/constants';

const defaultState = {
    feedings: [],
    currentMethod: null,
    start: null,
    timing: false,
};

export default function(state=defaultState, action){
    switch(action.type){
        case REHYDRATE:
            let rehydrateState = action.payload;
            if(!rehydrateState || Object.keys(rehydrateState).length <= 0){
                return state;
            }
            for(var i = 0; i < rehydrateState.feedings.length; i++){
                rehydrateState.feedings[i].start = new Date(rehydrateState.feedings[i].start);
                rehydrateState.feedings[i].end = new Date(rehydrateState.feedings[i].end);
            }
            if(rehydrateState.timing && rehydrateState.start){
                rehydrateState.start = new Date(rehydrateState.start);
            } else {
                rehydrateState.timing = false;
                rehydrateState.start = null;
            }
            return Object.assign({}, state, rehydrateState);
        case actionTypes.START_FEEDING:
            return Object.assign({}, state, {
                currentMethod: action.method,
                start: action.start,
                timing: true,
            });
        case actionTypes.STOP_FEEDING:
            let newFeedings = state.feedings.slice(0),
                now = new Date();
            newFeedings.push({
                method: state.currentMethod,
                start: state.start,
                end: now,
                length: now - state.start
            });
            return Object.assign({}, state, {
                feedings: newFeedings,
                timing: false,
            });
        case actionTypes.DELETE_FEEDING:
            let deleteFeedings = state.feedings.slice(0);
            deleteFeedings.splice(action.index, 1);
            return Object.assign({}, state, {
                feedings: deleteFeedings,
            });
        default:
            return state;
    }
}

