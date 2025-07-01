import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../services/api';
import type { Dispatch } from '@reduxjs/toolkit';

const ActionType = {
  RECEIVE_LEADERBOARDS: 'RECEIVE_LEADERBOARDS',
};

function receiveLeaderboardsActionCreator(leaderboards : any) {
  return {
    type: ActionType.RECEIVE_LEADERBOARDS,
    payload: {
      leaderboards,
    },
  };
}

function asyncPopulateLeaderboards() {
  return async (dispatch: Dispatch) => {
    dispatch(showLoading());
    try {
      const leaderboards = await api.seeLeaderboards();
      dispatch(receiveLeaderboardsActionCreator(leaderboards));
    } catch (error) {
      alert((error as { message: string }).message);
    }
    dispatch(hideLoading());
  };
}

export {
  ActionType,
  receiveLeaderboardsActionCreator,
  asyncPopulateLeaderboards,
};