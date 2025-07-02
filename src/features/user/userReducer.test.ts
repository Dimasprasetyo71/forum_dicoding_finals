import { describe, it, expect } from 'vitest';
import usersReducer from './reduce';
import { ActionType } from './action';
import type { User } from '../../types';

describe('usersReducer', () => {
    it('should return initial state when given by undefined state', () => {
        const nextState = usersReducer(undefined, { type: 'UNKNOWN_ACTION' });
        expect(nextState).toEqual([]);
    });

    it('should return users when action type is RECEIVE_USERS', () => {
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

        const action = {
            type: ActionType.RECEIVE_USERS,
            payload: {
                users: fakeUsers,
            },
        };

        const nextState = usersReducer([], action);
        expect(nextState).toEqual(fakeUsers);
    });

    it('should return previous state when action type is unknown', () => {
        const initialState: User[] = [
            {
                id: '1', name: 'Alice', email: 'alice@example.com',
                avatar: ''
            },
        ];

        const action = { type: 'UNKNOWN_ACTION' };

        const nextState = usersReducer(initialState, action);
        expect(nextState).toBe(initialState);
    });
});
