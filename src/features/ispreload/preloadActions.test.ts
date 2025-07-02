import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    ActionType,
    setIsPreloadActionCreator,
    asyncPreloadProcess,
} from './action';
import api from '../../services/api';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { setAuthUserActionCreator } from '../auth/action';

vi.mock('../../services/api', () => ({
    default: {
        getOwnProfile: vi.fn(),
    },
}));

vi.mock('react-redux-loading-bar', () => ({
    showLoading: vi.fn(() => ({ type: 'SHOW_LOADING' })),
    hideLoading: vi.fn(() => ({ type: 'HIDE_LOADING' })),
}));

vi.mock('../auth/action', () => ({
    setAuthUserActionCreator: vi.fn((user) => ({
        type: 'SET_AUTH_USER',
        payload: { user },
    })),
}));

describe('setIsPreloadActionCreator', () => {
    it('should create action correctly', () => {
        const action = setIsPreloadActionCreator(true);
        expect(action).toEqual({
            type: ActionType.SET_IS_PRELOAD,
            payload: {
                isPreload: true,
            },
        });
    });
});

describe('asyncPreloadProcess', () => {
    const dispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should dispatch correct actions when API succeeds', async () => {
        const fakeUser = { id: '1', name: 'Alice' };

        (api.getOwnProfile as ReturnType<typeof vi.fn>).mockResolvedValueOnce(fakeUser);

        await asyncPreloadProcess()(dispatch);

        expect(dispatch).toHaveBeenCalledWith(showLoading());
        expect(api.getOwnProfile).toHaveBeenCalled();
        expect(setAuthUserActionCreator).toHaveBeenCalledWith(fakeUser);
        expect(dispatch).toHaveBeenCalledWith({
            type: 'SET_AUTH_USER',
            payload: { user: fakeUser },
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: ActionType.SET_IS_PRELOAD,
            payload: { isPreload: false },
        });
        expect(dispatch).toHaveBeenCalledWith(hideLoading());
    });

    it('should dispatch correct actions when API fails', async () => {
        (api.getOwnProfile as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Unauthorized'));

        await asyncPreloadProcess()(dispatch);

        expect(dispatch).toHaveBeenCalledWith(showLoading());
        expect(api.getOwnProfile).toHaveBeenCalled();
        expect(setAuthUserActionCreator).toHaveBeenCalledWith(null);
        expect(dispatch).toHaveBeenCalledWith({
            type: 'SET_AUTH_USER',
            payload: { user: null },
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: ActionType.SET_IS_PRELOAD,
            payload: { isPreload: false },
        });
        expect(dispatch).toHaveBeenCalledWith(hideLoading());
    });
});
