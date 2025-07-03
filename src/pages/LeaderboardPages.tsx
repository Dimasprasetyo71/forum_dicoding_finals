import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LeaderBoardItem from '../components/leaderboard/LeaderBoardItem';
import { asyncPopulateLeaderboards } from '../features/leaderboards/action';
import { type ThunkDispatch } from 'redux-thunk';
import type { AnyAction } from '@reduxjs/toolkit';

interface Leaderboard {
  user: {
    id: string;
    name: string;
    email?: string;
    avatar: string;
  };
  score: number;
}

interface RootState {
  leaderboards: Leaderboard[];
  isLoading?: boolean;
}

const LeaderboardSkeleton = () => (
  <div className="flex items-center justify-between p-4 border-b animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
      </div>
    </div>
    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
  </div>
);

// Multiple skeleton items
const LeaderboardSkeletonList = () => (
  <>
    {Array.from({ length: 10 }, (_, index) => (
      <LeaderboardSkeleton key={index} />
    ))}
  </>
);

export default function LeaderboardsPage() {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const { leaderboards = [], isLoading = false } = useSelector((state: RootState) => state);

  useEffect(() => {
    dispatch(asyncPopulateLeaderboards());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto my-6 bg-white dark:bg-gray-800 border rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Leaderboards
        </h1>
      </div>

      <div className="flex justify-between px-4 py-2 border-b">
        <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
          10 Pengguna Teratas
        </span>
        <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
          Skor
        </span>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <LeaderboardSkeletonList />
      ) : (
        /* Loaded state */
        <>
          {leaderboards.length > 0 ? (
            leaderboards.map(({ user, score }) => (
              <LeaderBoardItem key={user.id} user={user} score={score} />
            ))
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-center">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <p className="text-lg font-medium">Belum ada data leaderboard</p>
                <p className="text-sm mt-1">Data akan muncul setelah ada aktivitas pengguna</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}