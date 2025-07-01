import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../services/api';
import type { RegisterPayload, User } from '../../types';
import type { Dispatch } from '@reduxjs/toolkit';
const ActionType = {
  RECEIVE_USERS: 'RECEIVE_USERS',
  ERROR_RECEIVE_USERS: 'ERROR_RECEIVE_USERS',
};

function receiveUsersActionCreator(users : User[]) {
  return {
    type: ActionType.RECEIVE_USERS,
    payload: {
      users,
    },
  };
}

function asyncRegisterUser({ name, email, password }: RegisterPayload) {
  return async (dispatch: Dispatch) => {
    dispatch(showLoading());
    try {
      await api.register({ name, email, password });
    } catch (error) {
      alert((error as { message: string }).message);
    }
    dispatch(hideLoading());
  };
}

export { ActionType, receiveUsersActionCreator, asyncRegisterUser };