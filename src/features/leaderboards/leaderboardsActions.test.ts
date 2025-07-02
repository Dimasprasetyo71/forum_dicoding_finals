import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    ActionType,
    receiveLeaderboardsActionCreator,
    asyncPopulateLeaderboards,
} from './action';
import api from '../../services/api';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

vi.mock('../../services/api', () => ({
    default: {
        seeLeaderboards: vi.fn(),
    },
}));

vi.mock('react-redux-loading-bar', () => ({
    showLoading: vi.fn(() => ({ type: 'SHOW_LOADING' })),
    hideLoading: vi.fn(() => ({ type: 'HIDE_LOADING' })),
}));

describe('receiveLeaderboardsActionCreator', () => {
    it('should create action correctly', () => {
        const fakeLeaderboards = [
            { user: { id: '1', name: 'Alice' }, score: 100 },
        ];

        const action = receiveLeaderboardsActionCreator(fakeLeaderboards);

        expect(action).toEqual({
            type: ActionType.RECEIVE_LEADERBOARDS,
            payload: {
                leaderboards: fakeLeaderboards,
            },
        });
    });
});

describe('asyncPopulateLeaderboards', () => {
    const dispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should dispatch actions correctly when API call succeeds', async () => {
        const fakeLeaderboards = [
            { user: { id: '1', name: 'Alice' }, score: 100 },
        ];

        (api.seeLeaderboards as ReturnType<typeof vi.fn>).mockResolvedValueOnce(fakeLeaderboards);

        await asyncPopulateLeaderboards()(dispatch);

        expect(dispatch).toHaveBeenCalledWith(showLoading());
        expect(api.seeLeaderboards).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith({
            type: ActionType.RECEIVE_LEADERBOARDS,
            payload: {
                leaderboards: fakeLeaderboards,
            },
        });
        expect(dispatch).toHaveBeenCalledWith(hideLoading());
    });

    it('should alert error message when API call fails', async () => {
        const fakeError = { message: 'Network Error' };

        (api.seeLeaderboards as ReturnType<typeof vi.fn>).mockRejectedValueOnce(fakeError);
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });

        await asyncPopulateLeaderboards()(dispatch);

        expect(dispatch).toHaveBeenCalledWith(showLoading());
        expect(api.seeLeaderboards).toHaveBeenCalled();
        expect(alertMock).toHaveBeenCalledWith('Network Error');
        expect(dispatch).toHaveBeenCalledWith(hideLoading());

        alertMock.mockRestore();
    });
});
