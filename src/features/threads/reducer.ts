import { ActionType } from './action';
import type { AnyAction } from '@reduxjs/toolkit';


export interface Thread {
    id: string;
    title: string;
    body: string;
    category: string;
    createdAt: string;
    ownerId: string;
    upVotesBy: string[];
    downVotesBy: string[];
}
export default function threadsReducer(threads : Thread[] = [], action = {} as AnyAction) {
  switch (action.type) {
  case ActionType.RECEIVE_THREADS:
    return action.payload.threads;
  case ActionType.CREATE_THREAD:
    return [action.payload.thread, ...threads];
  case ActionType.UP_VOTE_THREAD:
    return threads.map((thread) => {
      if (thread.id === action.payload.threadId) {
        return {
          ...thread,
          upVotesBy: thread.upVotesBy.includes(action.payload.userId)
            ? thread.upVotesBy.filter((id) => id !== action.payload.userId)
            : thread.upVotesBy.concat([action.payload.userId]),
          downVotesBy: thread.downVotesBy.includes(action.payload.userId)
            ? thread.downVotesBy.filter((id) => id !== action.payload.userId)
            : thread.downVotesBy,
        };
      }
      return thread;
    });
  case ActionType.DOWN_VOTE_THREAD:
    return threads.map((thread) => {
      if (thread.id === action.payload.threadId) {
        return {
          ...thread,
          upVotesBy: thread.upVotesBy.includes(action.payload.userId)
            ? thread.upVotesBy.filter((id) => id !== action.payload.userId)
            : thread.upVotesBy,
          downVotesBy: thread.downVotesBy.includes(action.payload.userId)
            ? thread.downVotesBy.filter((id) => id !== action.payload.userId)
            : thread.downVotesBy.concat([action.payload.userId]),
        };
      }
      return thread;
    });
  case ActionType.NETURALIZE_VOTE_THREAD:
    return threads.map((thread) => {
      if (thread.id === action.payload.threadId) {
        return {
          ...thread,
          upVotesBy: thread.upVotesBy.includes(action.payload.userId)
            ? thread.upVotesBy.filter((id) => id !== action.payload.userId)
            : thread.upVotesBy,
          downVotesBy: thread.downVotesBy.includes(action.payload.userId)
            ? thread.downVotesBy.filter((id) => id !== action.payload.userId)
            : thread.downVotesBy,
        };
      }
      return thread;
    });

  default:
    return threads;
  }
}