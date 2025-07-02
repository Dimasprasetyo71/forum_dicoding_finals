import { describe, it, expect } from 'vitest';
import isPreloadReducer from './reducer';
import { ActionType } from './action';

describe('isPreloadReducer', () => {
    it('should return initial state when given undefined state', () => {
        const nextState = isPreloadReducer(undefined, { type: 'UNKNOWN_ACTION' });
        expect(nextState).toBe(true);
    });

    it('should return payload.isPreload when action type is SET_IS_PRELOAD', () => {
        const actionTrue = {
            type: ActionType.SET_IS_PRELOAD,
            payload: { isPreload: true },
        };
        const actionFalse = {
            type: ActionType.SET_IS_PRELOAD,
            payload: { isPreload: false },
        };

        const stateWhenTrue = isPreloadReducer(true, actionTrue);
        const stateWhenFalse = isPreloadReducer(true, actionFalse);

        expect(stateWhenTrue).toBe(true);
        expect(stateWhenFalse).toBe(false);
    });

    it('should return previous state when action type is unknown', () => {
        const prevState = false;
        const nextState = isPreloadReducer(prevState, { type: 'UNKNOWN_ACTION' });
        expect(nextState).toBe(prevState);
    });
});
