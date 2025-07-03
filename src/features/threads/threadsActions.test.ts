import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ActionType,
  receiveThreadsActionCreator,
  createThreadActionCreator,
  upVoteThreadActionCreator,
  downVoteThreadActionCreator,
  neturalizeVoteThreadActionCreator,
  asyncCreateThread,
  asyncUpVoteThread,
  asyncDownVoteThread,
  asyncNeturalizeVoteThread,
} from './action';
import api from '../../services/api';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

vi.mock('../../services/api', () => ({
  default: {
    createThread: vi.fn(),
    upVoteThread: vi.fn(),
    downVoteThread: vi.fn(),
    neutralizeVoteThread: vi.fn(),
  },
}));

vi.mock('react-redux-loading-bar', () => ({
  showLoading: vi.fn(() => ({ type: 'SHOW_LOADING' })),
  hideLoading: vi.fn(() => ({ type: 'HIDE_LOADING' })),
}));

describe('Action Creators', () => {
  it('receiveThreadsActionCreator should create correct action', () => {
    const threads = [{
      id: 'thread-1',
      title: 'Thread title',
      body: 'Thread body',
      category: 'general',
      ownerId: 'user-1', // add ownerId property
      upVotesBy: [], // add upVotesBy property
      downVotesBy: [], // add downVotesBy property
      totalComments: 0, // add totalComments property
      createdAt: '2021-01-01T00:00:00.000Z',
    }];
    expect(receiveThreadsActionCreator(threads)).toEqual({
      type: ActionType.RECEIVE_THREADS,
      payload: { threads },
    });
  });

  it('createThreadActionCreator should create correct action', () => {
    const thread = {
      id: 'thread-1',
      title: 'Thread title',
      body: 'Thread body',
      category: 'general',
      ownerId: 'user-1',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
      createdAt: '2021-01-01T00:00:00.000Z',
    };
    expect(createThreadActionCreator(thread)).toEqual({
      type: ActionType.CREATE_THREAD,
      payload: { thread },
    });
  });

  it('upVoteThreadActionCreator should create correct action', () => {
    const input = { threadId: 'thread-1', userId: 'user-1' };
    expect(upVoteThreadActionCreator(input)).toEqual({
      type: ActionType.UP_VOTE_THREAD,
      payload: input,
    });
  });

  it('downVoteThreadActionCreator should create correct action', () => {
    const input = { threadId: 'thread-1', userId: 'user-1' };
    expect(downVoteThreadActionCreator(input)).toEqual({
      type: ActionType.DOWN_VOTE_THREAD,
      payload: input,
    });
  });

  it('neturalizeVoteThreadActionCreator should create correct action', () => {
    const input = { threadId: 'thread-1', userId: 'user-1' };
    expect(neturalizeVoteThreadActionCreator(input)).toEqual({
      type: ActionType.NETURALIZE_VOTE_THREAD,
      payload: input,
    });
  });
});

describe('Async Action Creators', () => {
  const dispatch = vi.fn();
  const getState = vi.fn(() => ({
    authUser: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '',
    },
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('asyncCreateThread should dispatch actions on success', async () => {
    const fakeThread = {
      id: 'thread-1',
      title: 'Test Thread',
      body: 'This is a test thread',
      category: 'general',
      ownerId: 'user-1',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
      createdAt: '2021-01-01T00:00:00.000Z',
    };
    (api.createThread as ReturnType<typeof vi.fn>).mockResolvedValueOnce(fakeThread);

    await asyncCreateThread({
      title: 'test',
      body: 'test body',
      category: 'general',
    })(dispatch);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.createThread).toHaveBeenCalledWith({
      title: 'test',
      body: 'test body',
      category: 'general',
    });
    expect(dispatch).toHaveBeenCalledWith(createThreadActionCreator(fakeThread));
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('asyncCreateThread should alert on failure', async () => {
    const error = new Error('API Error');
    (api.createThread as ReturnType<typeof vi.fn>).mockRejectedValueOnce(error);
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });

    await asyncCreateThread({
      title: 'test',
      body: 'test body',
      category: 'general',
    })(dispatch);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(alertMock).toHaveBeenCalledWith('API Error');
    expect(dispatch).toHaveBeenCalledWith(hideLoading());

    alertMock.mockRestore();
  });

  it('asyncUpVoteThread should dispatch upVote and rollback on failure', async () => {
    (api.upVoteThread as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Failed upvote'));
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });

    await asyncUpVoteThread('thread-1')(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(upVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }));
    expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
    expect(alertMock).toHaveBeenCalledWith('Failed upvote');
    expect(dispatch).toHaveBeenCalledWith(downVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }));

    alertMock.mockRestore();
  });

  it('asyncDownVoteThread should dispatch downVote and rollback on failure', async () => {
    (api.downVoteThread as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Failed downvote'));
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });

    await asyncDownVoteThread('thread-1')(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(downVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }));
    expect(api.downVoteThread).toHaveBeenCalledWith('thread-1');
    expect(alertMock).toHaveBeenCalledWith('Failed downvote');
    expect(dispatch).toHaveBeenCalledWith(downVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }));

    alertMock.mockRestore();
  });

  it('asyncNeturalizeVoteThread should dispatch neturalizeVote and rollback on failure', async () => {
    (api.neutralizeVoteThread as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Failed neutralize'));
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });

    await asyncNeturalizeVoteThread('thread-1')(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(neturalizeVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }));
    expect(api.neutralizeVoteThread).toHaveBeenCalledWith('thread-1');
    expect(alertMock).toHaveBeenCalledWith('Failed neutralize');
    expect(dispatch).toHaveBeenCalledWith(neturalizeVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }));

    alertMock.mockRestore();
  });
});
