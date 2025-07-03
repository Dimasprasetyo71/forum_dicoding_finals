import { ActionType } from './action';
import type { AnyAction } from '@reduxjs/toolkit';

export default function isPreloadReducer(isPreload = true, action: AnyAction) {
  switch (action.type) {
  case ActionType.SET_IS_PRELOAD:
    return action.payload.isPreload;
  default:
    return isPreload;
  }
}