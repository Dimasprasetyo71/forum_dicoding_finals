import { configureStore,  type ThunkAction,  type Action } from '@reduxjs/toolkit';
import usersReducer from '../features/user/reduce';
import isPreloadReducer from '../features/ispreload/reducer';
import threadReducer from '../features/threads/reducer';
import threadDetailReducer from '../features/threads/Detail/reducer';
import leaderboardsReducer from '../features/leaderboards/reducer';
import { loadingBarReducer } from 'react-redux-loading-bar';
import authUserReducer from '../features/auth/reducer';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    isPreload: isPreloadReducer,
    threads: threadReducer,
    threadDetail: threadDetailReducer,
    leaderboards: leaderboardsReducer,
    authUser: authUserReducer,
    loadingBar: loadingBarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false, // ⬅️ mematikan pengecekan immutable
      serializableCheck: true, // opsional, masih aktif
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ OPTIONAL: Thunk type helper
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;


export default store;
