import type { AnyAction } from '@reduxjs/toolkit';
import { ActionType } from './action';

export default function usersReducer(users = [], action: AnyAction) {
  switch (action.type) {
  case ActionType.RECEIVE_USERS:
    return action.payload.users;
  default:
    return users;
  }
}