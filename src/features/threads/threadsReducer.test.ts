import { describe, it, expect } from 'vitest';
import threadsReducer, {type  Thread } from './reducer';
import { ActionType } from './action';

describe('threadsReducer', () => {
    const initialThreads: Thread[] = [
        {
            id: 'thread-1',
            title: 'Title 1',
            body: 'Body 1',
            category: 'general',
            createdAt: '2024-01-01',
            ownerId: 'user-1',
            upVotesBy: [],
            downVotesBy: [],
        },
        {
            id: 'thread-2',
            title: 'Title 2',
            body: 'Body 2',
            category: 'general',
            createdAt: '2024-01-01',
            ownerId: 'user-2',
            upVotesBy: [],
            downVotesBy: [],
        },
    ];

    it('should return initial state when given unknown action', () => {
        const nextState = threadsReducer(initialThreads, { type: 'UNKNOWN_ACTION' });
        expect(nextState).toBe(initialThreads);
    });

    it('should handle RECEIVE_THREADS correctly', () => {
        const newThreads: Thread[] = [
            { ...initialThreads[0], id: 'thread-3' },
        ];
        const action = {
            type: ActionType.RECEIVE_THREADS,
            payload: { threads: newThreads },
        };
        const nextState = threadsReducer([], action);
        expect(nextState).toEqual(newThreads);
    });

    it('should handle CREATE_THREAD correctly', () => {
        const newThread: Thread = {
            id: 'thread-3',
            title: 'New Thread',
            body: 'New body',
            category: 'general',
            createdAt: '2024-01-01',
            ownerId: 'user-3',
            upVotesBy: [],
            downVotesBy: [],
        };

        const action = {
            type: ActionType.CREATE_THREAD,
            payload: { thread: newThread },
        };

        const nextState = threadsReducer(initialThreads, action);
        expect(nextState).toEqual([newThread, ...initialThreads]);
    });

    it('should handle UP_VOTE_THREAD to add upvote and remove downvote if exists', () => {
        const stateWithDownVote: Thread[] = [
            {
                ...initialThreads[0],
                downVotesBy: ['user-1'],
            },
        ];

        const action = {
            type: ActionType.UP_VOTE_THREAD,
            payload: { threadId: 'thread-1', userId: 'user-1' },
        };

        const nextState = threadsReducer(stateWithDownVote, action);
        expect(nextState[0].upVotesBy).toContain('user-1');
        expect(nextState[0].downVotesBy).not.toContain('user-1');
    });

    it('should handle UP_VOTE_THREAD to remove existing upvote if already voted', () => {
        const stateWithUpVote: Thread[] = [
            {
                ...initialThreads[0],
                upVotesBy: ['user-1'],
            },
        ];

        const action = {
            type: ActionType.UP_VOTE_THREAD,
            payload: { threadId: 'thread-1', userId: 'user-1' },
        };

        const nextState = threadsReducer(stateWithUpVote, action);
        expect(nextState[0].upVotesBy).not.toContain('user-1');
    });

    it('should handle DOWN_VOTE_THREAD to add downvote and remove upvote if exists', () => {
        const stateWithUpVote: Thread[] = [
            {
                ...initialThreads[0],
                upVotesBy: ['user-1'],
            },
        ];

        const action = {
            type: ActionType.DOWN_VOTE_THREAD,
            payload: { threadId: 'thread-1', userId: 'user-1' },
        };

        const nextState = threadsReducer(stateWithUpVote, action);
        expect(nextState[0].downVotesBy).toContain('user-1');
        expect(nextState[0].upVotesBy).not.toContain('user-1');
    });

    it('should handle DOWN_VOTE_THREAD to remove existing downvote if already voted', () => {
        const stateWithDownVote: Thread[] = [
            {
                ...initialThreads[0],
                downVotesBy: ['user-1'],
            },
        ];

        const action = {
            type: ActionType.DOWN_VOTE_THREAD,
            payload: { threadId: 'thread-1', userId: 'user-1' },
        };

        const nextState = threadsReducer(stateWithDownVote, action);
        expect(nextState[0].downVotesBy).not.toContain('user-1');
    });

    it('should handle NETURALIZE_VOTE_THREAD to remove upvote and downvote if exists', () => {
        const stateWithVotes: Thread[] = [
            {
                ...initialThreads[0],
                upVotesBy: ['user-1'],
                downVotesBy: ['user-2'],
            },
        ];

        const action = {
            type: ActionType.NETURALIZE_VOTE_THREAD,
            payload: { threadId: 'thread-1', userId: 'user-1' },
        };

        const nextState = threadsReducer(stateWithVotes, action);
        expect(nextState[0].upVotesBy).not.toContain('user-1');
        expect(nextState[0].downVotesBy).toContain('user-2');
    });
});
