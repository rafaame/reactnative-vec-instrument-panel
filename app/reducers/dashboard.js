import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const receiveData = createReducer({}, {
	[types.RECEIVE_DATA](state, action) {
		let newState = Object.assign({}, state);

		newState.receiveTime = (new Date()).getTime();
		newState.engineRpm = parseInt(action.data.engineRpm);
		newState.speed = parseInt(action.data.speed);

		newState.isDriverPresent = !! action.data.isDriverPresent;
		newState.isTurnLeftOn = !! action.data.isTurnLeftOn;
        newState.isTurnRightOn = !! action.data.isTurnRightOn;
        newState.isHeadlampOn = !! action.data.isHeadlampOn;
        newState.hasOpenDoor = !! action.data.hasOpenDoor;
        newState.hasOilPressure = !! action.data.hasOilPressure;
        newState.isParkingBrakeOn = !! action.data.isParkingBrakeOn;
        newState.isKeyOnFirstPos = !! action.data.isKeyOnFirstPos;
        newState.isKeyAfterFirstPos = !! action.data.isKeyAfterFirstPos;
		
		newState.dataJson = JSON.stringify(action.data, null, 4);

		if (! newState.engineRpmHistory) {
			newState.engineRpmHistory = [];
		}

		if (! newState.speedHistory) {
			newState.speedHistory = [];
		}

		if (! newState.receiveTimeHistory) {
			newState.receiveTimeHistory = [];
		}

		newState.engineRpmHistory.unshift(newState.engineRpm);
		newState.engineRpmHistory = newState.engineRpmHistory.slice(0, 4);

		newState.speedHistory.unshift(newState.speed);
		newState.speedHistory = newState.speedHistory.slice(0, 4);

		newState.receiveTimeHistory.unshift(newState.receiveTime);
		newState.receiveTimeHistory = newState.receiveTimeHistory.slice(0, 4);

		return newState;
	}
});