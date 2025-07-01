import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../services/api';
import type { Thread, User } from '../../types';


export interface RootState {
  authUser: User;
}

export const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
  CREATE_THREAD: 'CREATE_THREAD',
  UP_VOTE_THREAD: 'UP_VOTE_THREAD',
  DOWN_VOTE_THREAD: 'DOWN_VOTE_THREAD',
  NETURALIZE_VOTE_THREAD: 'NETURALIZE_VOTE_THREAD',
} as const;



export function receiveThreadsActionCreator(threads: Thread[]) {
  return {
    type: ActionType.RECEIVE_THREADS,
    payload: { threads },
  };
}

export function createThreadActionCreator(thread: Thread) {
  return {
    type: ActionType.CREATE_THREAD,
    payload: { thread },
  };
}

export function upVoteThreadActionCreator({
  threadId,
  userId,
}: {
  threadId: string;
  userId: string;
}) {
  return {
    type: ActionType.UP_VOTE_THREAD,
    payload: { threadId, userId },
  };
}

export function downVoteThreadActionCreator({
  threadId,
  userId,
}: {
  threadId: string;
  userId: string;
}) {
  return {
    type: ActionType.DOWN_VOTE_THREAD,
    payload: { threadId, userId },
  };
}

export function neturalizeVoteThreadActionCreator({
  threadId,
  userId,
}: {
  threadId: string;
  userId: string;
}) {
  return {
    type: ActionType.NETURALIZE_VOTE_THREAD,
    payload: { threadId, userId },
  };
}

// =======================
// Async Action Creators (Thunk)
// =======================

export function asyncCreateThread({
  title,
  body,
  category,
}: {
  title: string;
  body: string;
  category: string;
}) {
  return async (dispatch: any) => {
    dispatch(showLoading());
    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(createThreadActionCreator(thread));
    } catch (error: any) {
      alert(error.message);
    }
    dispatch(hideLoading());
  };
}

export function asyncUpVoteThread(threadId: string) {
  return async (dispatch: any, getState: () => RootState) => {
    const { authUser } = getState();
    dispatch(upVoteThreadActionCreator({ threadId, userId: authUser.id }));
    try {
      await api.upVoteThread(threadId);
    } catch (error: any) {
      alert(error.message);
      dispatch(downVoteThreadActionCreator({ threadId, userId: authUser.id }));
    }
  };
}

export function asyncDownVoteThread(threadId: string) {
  return async (dispatch: any, getState: () => RootState) => {
    const { authUser } = getState();
    dispatch(downVoteThreadActionCreator({ threadId, userId: authUser.id }));
    try {
      await api.downVoteThread(threadId);
    } catch (error: any) {
      alert(error.message);
      dispatch(downVoteThreadActionCreator({ threadId, userId: authUser.id }));
    }
  };
}

export function asyncNeturalizeVoteThread(threadId: string) {
  return async (dispatch: any, getState: () => RootState) => {
    const { authUser } = getState();
    dispatch(
      neturalizeVoteThreadActionCreator({ threadId, userId: authUser.id })
    );
    try {
      await api.neutralizeVoteThread(threadId);
    } catch (error: any) {
      alert(error.message);
      dispatch(
        neturalizeVoteThreadActionCreator({ threadId, userId: authUser.id })
      );
    }
  };
}
