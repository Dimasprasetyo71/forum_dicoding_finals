import type { AnyAction } from '@reduxjs/toolkit';
import { ActionType } from './action';
import type { User } from '../../types';

export default function usersReducer(users: User[] = [], action: AnyAction) {
  switch (action.type) {
  case ActionType.RECEIVE_USERS:
    return action.payload.users;
  default:
    return users;
  }
}