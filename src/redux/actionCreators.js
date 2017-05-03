import actionTypes from './actionTypes';

export function startFeeding(method){
    return {
        type: actionTypes.START_FEEDING,
        start: new Date(),
        method
    }
}

export function stopFeeding(){
    return {
        type: actionTypes.STOP_FEEDING
    }
}

export function deleteFeeding(index){
    return {
        type: actionTypes.DELETE_FEEDING,
        index
    }
}