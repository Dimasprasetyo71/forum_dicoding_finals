import { describe, it, expect } from 'vitest';
import leaderboardsReducer from './reducer';
import { ActionType } from './action';

describe('leaderboardsReducer', () => {
    it('should return initial state when given undefined state', () => {
        const nextState = leaderboardsReducer(undefined, { type: 'UNKNOWN_ACTION' });
        expect(nextState).toEqual([]);
    });

    it('should return leaderboards when action type is RECEIVE_LEADERBOARDS', () => {
        const fakeLeaderboards = [
            { user: { id: '1', name: 'Alice' }, score: 100 },
            { user: { id: '2', name: 'Bob' }, score: 90 },
        ];

        const action = {
            type: ActionType.RECEIVE_LEADERBOARDS,
            payload: {
                leaderboards: fakeLeaderboards,
            },
        };

        const nextState = leaderboardsReducer([], action);
        expect(nextState).toEqual(fakeLeaderboards);
    });

    it('should return previous state when action type is unknown', () => {
        const initialState = [
            {
                user: {
                    id: '1',
                    name: 'Alice',
                    email: 'alice@example.com',
                    avatar: ''
                },
                score: 100
            }
        ];

        const action = { type: 'UNKNOWN_ACTION' };

        const nextState = leaderboardsReducer(initialState, action);
        expect(nextState).toBe(initialState);
    });
});
