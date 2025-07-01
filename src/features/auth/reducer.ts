import { ActionType } from './action';
import type { AnyAction } from '@reduxjs/toolkit';

export default function authUserReducer(authUser = null, action: AnyAction) {
    switch (action.type) {
        case ActionType.SET_AUTH_USER:
            return action.payload.authUser;
        case ActionType.UNSET_AUTH_USER:
            return null;
        default:
            return authUser;
    }
}