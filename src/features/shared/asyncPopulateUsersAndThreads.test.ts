import { describe, it, expect, vi, beforeEach, } from 'vitest';
import asyncPopulateUsersAndThreads from './action';
import api from '../../services/api';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { receiveUsersActionCreator } from '../user/action';
import { receiveThreadsActionCreator } from '../threads/action';
import type { User } from '../../types';

// Mock API and dependencies
vi.mock('../../services/api', () => ({
  default: {
    getAllUsers: vi.fn(),
    seeAllThreads: vi.fn(),
  },
}));

vi.mock('react-redux-loading-bar', () => ({
  showLoading: vi.fn(() => ({ type: 'SHOW_LOADING' })),
  hideLoading: vi.fn(() => ({ type: 'HIDE_LOADING' })),
}));

vi.mock('../user/action', () => ({
  receiveUsersActionCreator: vi.fn((users) => ({
    type: 'RECEIVE_USERS',
    payload: { users },
  })),
}));

vi.mock('../threads/action', () => ({
  receiveThreadsActionCreator: vi.fn((threads) => ({
    type: 'RECEIVE_THREADS',
    payload: { threads },
  })),
}));

describe('asyncPopulateUsersAndThreads', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch actions correctly when API calls succeed', async () => {
    // Arrange
    const fakeUsers: User[] = [
      {
        id: '1', name: 'Alice', email: 'alice@example.com',
        avatar: ''
      },
    ];
    const fakeThreads = [
      { id: 'thread-1', title: 'First Thread' },
    ];

    (api.getAllUsers as ReturnType<typeof vi.fn>).mockResolvedValueOnce(fakeUsers);
    (api.seeAllThreads as ReturnType<typeof vi.fn>).mockResolvedValueOnce(fakeThreads);

    // Act
    await asyncPopulateUsersAndThreads()(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getAllUsers).toHaveBeenCalled();
    expect(receiveUsersActionCreator).toHaveBeenCalledWith(fakeUsers);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'RECEIVE_USERS',
      payload: { users: fakeUsers },
    });
    expect(api.seeAllThreads).toHaveBeenCalled();
    expect(receiveThreadsActionCreator).toHaveBeenCalledWith(fakeThreads);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'RECEIVE_THREADS',
      payload: { threads: fakeThreads },
    });
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should alert error when API call fails', async () => {
    const fakeError = { message: 'Something went wrong' };

    (api.getAllUsers as ReturnType<typeof vi.fn>).mockRejectedValueOnce(fakeError);

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });

    await asyncPopulateUsersAndThreads()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(alertMock).toHaveBeenCalledWith('Something went wrong');
    expect(dispatch).toHaveBeenCalledWith(hideLoading());

    alertMock.mockRestore();
  });
});
