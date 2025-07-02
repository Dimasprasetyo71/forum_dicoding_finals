import { describe, it, expect, vi, beforeEach,} from 'vitest';
import { asyncRegisterUser, receiveUsersActionCreator, ActionType } from './action';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import api from '../../services/api';
import type { User } from '../../types';

vi.mock('../../services/api', () => ({
    default: {
        register: vi.fn(),
    },
}));

vi.mock('react-redux-loading-bar', () => ({
    showLoading: vi.fn(() => ({ type: 'SHOW_LOADING' })),
    hideLoading: vi.fn(() => ({ type: 'HIDE_LOADING' })),
}));

describe('receiveUsersActionCreator', () => {
    it('should create action with correct type and payload', () => {
        const fakeUsers: User[] = [
            {
                id: '1', name: 'Alice', email: 'alice@example.com',
                avatar: ''
            },
            {
                id: '2', name: 'Bob', email: 'bob@example.com',
                avatar: ''
            },
        ];

        const action = receiveUsersActionCreator(fakeUsers);

        expect(action).toEqual({
            type: ActionType.RECEIVE_USERS,
            payload: {
                users: fakeUsers,
            },
        });
    });
});

describe('asyncRegisterUser', () => {
    const dispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should dispatch showLoading and hideLoading on success', async () => {
        // Arrange
        const fakePayload = { name: 'Test', email: 'test@example.com', password: 'secret' };
        (api.register as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});

        // Act
        await asyncRegisterUser(fakePayload)(dispatch);

        // Assert
        expect(dispatch).toHaveBeenCalledWith(showLoading());
        expect(api.register).toHaveBeenCalledWith(fakePayload);
        expect(dispatch).toHaveBeenCalledWith(hideLoading());
    });

    it('should alert error message when api.register throws', async () => {
        const fakePayload = { name: 'Test', email: 'test@example.com', password: 'secret' };
        const fakeError = { message: 'Registration failed' };

        (api.register as ReturnType<typeof vi.fn>).mockRejectedValueOnce(fakeError);
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });

        await asyncRegisterUser(fakePayload)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(showLoading());
        expect(api.register).toHaveBeenCalledWith(fakePayload);
        expect(alertMock).toHaveBeenCalledWith('Registration failed');
        expect(dispatch).toHaveBeenCalledWith(hideLoading());

        alertMock.mockRestore();
    });
});
