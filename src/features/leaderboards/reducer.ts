import type { Leaderboard } from '../../types';
import { ActionType } from './action';
import type { AnyAction } from '@reduxjs/toolkit';

export default function leaderboardsReducer(leaderboards: Leaderboard[] = [], action: AnyAction) {
  switch (action.type) {
  case ActionType.RECEIVE_LEADERBOARDS:
    return action.payload.leaderboards;
  default:
    return leaderboards;
  }
}