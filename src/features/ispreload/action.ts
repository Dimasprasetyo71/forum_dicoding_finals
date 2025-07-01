import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../services/api';
import {
  setAuthUserActionCreator } from '../auth/action';
import type { AppDispatch } from '../../store';

export const ActionType = {
  SET_IS_PRELOAD: 'SET_IS_PRELOAD',
} as const;
// Action Creator untuk preload flag
export function setIsPreloadActionCreator(isPreload: boolean) {
  return {
    type: ActionType.SET_IS_PRELOAD as typeof ActionType.SET_IS_PRELOAD,
    payload: {
      isPreload,
    },
  };
}

// Async Action Creator
export function asyncPreloadProcess() {
  return async (dispatch: AppDispatch) => {
    dispatch(showLoading());
    try {
      const authUser = await api.getOwnProfile();
      dispatch(setAuthUserActionCreator(authUser));
    } catch (error) {
      dispatch(setAuthUserActionCreator(null));
    } finally {
      dispatch(setIsPreloadActionCreator(false));
    }
    dispatch(hideLoading());
  };
}
