import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../../services/api';
import { type AppThunk } from '../../../store/index'; // pastikan path ini sesuai

// ========================
// Type Definitions
// ========================

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    avatar: string;
  };
  upVotesBy: string[];
  downVotesBy: string[];
};

export type ThreadDetail = {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  owner?: { id: string; name: string; avatar: string } | undefined;
  upVotesBy: string[];
  downVotesBy: string[];
  comments: Comment[];
};

export type User = {
  id: string;
  name: string;
  avatar: string;
};

export interface RootState {
  threadDetail: ThreadDetail;
  authUser: User;
}

// ========================
// Action Types
// ========================

export const ActionType = {
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  UP_VOTE_THREAD_DETAIL: 'UP_VOTE_THREAD_DETAIL',
  DOWN_VOTE_THREAD_DETAIL: 'DOWN_VOTE_THREAD_DETAIL',
  NEUTRALIZE_VOTE_THREAD_DETAIL: 'NEUTRALIZE_VOTE_THREAD_DETAIL',
  CREATE_COMMENT: 'CREATE_COMMENT',
  UP_VOTE_COMMENT: 'UP_VOTE_COMMENT',
  DOWN_VOTE_COMMENT: 'DOWN_VOTE_COMMENT',
  NEUTRALIZE_VOTE_COMMENT: 'NEUTRALIZE_VOTE_COMMENT',
} as const;

// ========================
// Action Creators
// ========================

export function receiveThreadDetailActionCreator(threadDetail: ThreadDetail) {
  return {
    type: ActionType.RECEIVE_THREAD_DETAIL,
    payload: { threadDetail },
  };
}

export function upVoteThreadDetailActionCreator(userId: string) {
  return {
    type: ActionType.UP_VOTE_THREAD_DETAIL,
    payload: { userId },
  };
}

export function downVoteThreadDetailActionCreator(userId: string) {
  return {
    type: ActionType.DOWN_VOTE_THREAD_DETAIL,
    payload: { userId },
  };
}

export function neutralizeVoteThreadDetailActionCreator(userId: string) {
  return {
    type: ActionType.NEUTRALIZE_VOTE_THREAD_DETAIL,
    payload: { userId },
  };
}

export function createCommentActionCreator(comment: Comment) {
  return {
    type: ActionType.CREATE_COMMENT,
    payload: { comment },
  };
}

export function upVoteCommentActionCreator(commentId: string, userId: string) {
  return {
    type: ActionType.UP_VOTE_COMMENT,
    payload: { commentId, userId },
  };
}

export function downVoteCommentActionCreator(commentId: string, userId: string) {
  return {
    type: ActionType.DOWN_VOTE_COMMENT,
    payload: { commentId, userId },
  };
}

export function neutralizeVoteCommentActionCreator(commentId: string, userId: string) {
  return {
    type: ActionType.NEUTRALIZE_VOTE_COMMENT,
    payload: { commentId, userId },
  };
}

// ========================
// Async Action Creators
// ========================

export const asyncReceiveThreadDetail = (threadId: string): AppThunk => async (dispatch) => {
  dispatch(showLoading());
  try {
    const threadDetail = await api.seeDetailThread(threadId);
    dispatch(receiveThreadDetailActionCreator(threadDetail));
  } catch (error: any) {
    alert(error.message);
  }
  dispatch(hideLoading());
};

export const asyncUpVoteThreadDetail = (): AppThunk => async (dispatch, getState) => {
  const { threadDetail, authUser } = getState();
  if (!threadDetail) return;

  dispatch(upVoteThreadDetailActionCreator(authUser!.id));
  try {
    await api.upVoteThread(threadDetail.id);
  } catch (error: any) {
    alert(error.message);
  }
};

export const asyncDownVoteThreadDetail = (): AppThunk => async (dispatch, getState) => {
  const { threadDetail, authUser } = getState();
  dispatch(downVoteThreadDetailActionCreator(authUser.id));
  try {
    await api.downVoteThread(threadDetail!.id);
  } catch (error: any) {
    alert(error.message);
  }
};

export const asyncNeutralizeVoteThreadDetail = (): AppThunk => async (dispatch, getState) => {
  const { threadDetail, authUser } = getState();
  dispatch(neutralizeVoteThreadDetailActionCreator(authUser.id));
  try {
    await api.neutralizeVoteThread(threadDetail!.id);
  } catch (error: any) {
    alert(error.message);
  }
};

export const asyncCreateComment = ({ content }: { content: string }): AppThunk => async (
  dispatch,
  getState
) => {
  dispatch(showLoading());
  const { threadDetail } = getState();
  try {
    const comment = await api.createComment({ content, threadId: threadDetail!.id });
    dispatch(createCommentActionCreator(comment));
  } catch (error: any) {
    alert(error.message);
  }
  dispatch(hideLoading());
};

export const asyncUpVoteComment = (commentId: string): AppThunk => async (dispatch, getState) => {
  const { authUser, threadDetail } = getState();
  dispatch(upVoteCommentActionCreator(commentId, authUser.id));
  try {
    await api.upVoteComment(commentId, {
      threadId: threadDetail!.id,
      commentId,
    });
  } catch (error: any) {
    alert(error.message);
  }
};

export const asyncDownVoteComment = (commentId: string): AppThunk => async (dispatch, getState) => {
  const { authUser, threadDetail } = getState();
  dispatch(downVoteCommentActionCreator(commentId, authUser.id));
  try {
    await api.downVoteComment({ threadId: threadDetail!.id, commentId });
  } catch (error: any) {
    alert(error.message);
  }
};

export const asyncNeutralizeVoteComment = (
  commentId: string
): AppThunk => async (dispatch, getState) => {
  const { authUser, threadDetail } = getState();
  dispatch(neutralizeVoteCommentActionCreator(commentId, authUser.id));
  try {
    await api.neutralizeVoteComment({ threadId: threadDetail!.id, commentId });
  } catch (error: any) {
    alert(error.message);
  }
};
