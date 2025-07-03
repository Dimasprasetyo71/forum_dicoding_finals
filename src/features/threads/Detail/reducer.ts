import { ActionType } from './actionTypes';
import type { ThreadDetail } from './action';
import type { AnyAction } from '@reduxjs/toolkit';

export default function threadDetailReducer(
  threadDetail: ThreadDetail | null = null,
  action: AnyAction
): ThreadDetail | null {
  switch (action.type) {
  case ActionType.RECEIVE_THREAD_DETAIL:
    return action.payload.threadDetail;
  case ActionType.UP_VOTE_THREAD_DETAIL:
    if (!threadDetail) return threadDetail;
    return {
      ...threadDetail,
      upVotesBy: threadDetail.upVotesBy.includes(action.payload.userId)
        ? threadDetail.upVotesBy.filter((id) => id !== action.payload.userId)
        : [...threadDetail.upVotesBy, action.payload.userId],
      downVotesBy: threadDetail.downVotesBy.filter((id) => id !== action.payload.userId),
    };
  case ActionType.DOWN_VOTE_THREAD_DETAIL:
    if (!threadDetail) return threadDetail;
    return {
      ...threadDetail,
      upVotesBy: threadDetail.upVotesBy.filter((id) => id !== action.payload.userId),
      downVotesBy: threadDetail.downVotesBy.includes(action.payload.userId)
        ? threadDetail.downVotesBy.filter((id) => id !== action.payload.userId)
        : [...threadDetail.downVotesBy, action.payload.userId],
    };
  case ActionType.NEUTRALIZE_VOTE_THREAD_DETAIL:
    if (!threadDetail) return threadDetail;
    return {
      ...threadDetail,
      upVotesBy: threadDetail.upVotesBy.filter((id) => id !== action.payload.userId),
      downVotesBy: threadDetail.downVotesBy.filter((id) => id !== action.payload.userId),
    };
  case ActionType.CREATE_COMMENT:
    if (!threadDetail) return threadDetail;
    return {
      ...threadDetail,
      comments: [action.payload.comment, ...threadDetail.comments],
    };
  case ActionType.UP_VOTE_COMMENT:
  case ActionType.DOWN_VOTE_COMMENT:
  case ActionType.NEUTRALIZE_VOTE_COMMENT:
    if (!threadDetail) return threadDetail;
    return {
      ...threadDetail,
      comments: threadDetail.comments.map((comment) => {
        if (comment.id !== action.payload.commentId) return comment;
        const isUp = action.type === ActionType.UP_VOTE_COMMENT;
        const isDown = action.type === ActionType.DOWN_VOTE_COMMENT;
        const updatedUpVotes = isUp
          ? comment.upVotesBy.includes(action.payload.userId)
            ? comment.upVotesBy.filter((id) => id !== action.payload.userId)
            : [...comment.upVotesBy, action.payload.userId]
          : comment.upVotesBy.filter((id) => id !== action.payload.userId);
        const updatedDownVotes = isDown
          ? comment.downVotesBy.includes(action.payload.userId)
            ? comment.downVotesBy.filter((id) => id !== action.payload.userId)
            : [...comment.downVotesBy, action.payload.userId]
          : comment.downVotesBy.filter((id) => id !== action.payload.userId);
        return {
          ...comment,
          upVotesBy: updatedUpVotes,
          downVotesBy: updatedDownVotes,
        };
      }),
    };
  default:
    return threadDetail;
  }
}