import { useEffect, useState, useMemo, useCallback } from 'react';
import {  useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ThreadsList from '../components/threads/ThreadsList';
import asyncPopulateUsersAndThreads from '../features/shared/action';
import {
  asyncUpVoteThread,
  asyncDownVoteThread,
  asyncNeturalizeVoteThread,
} from '../features/threads/action';
import { useAppDispatch } from '../store/hooks';

interface RootState {
    threads: any[];
    users: any[];
    authUser?: { id: string };
}

export default function HomePage() {
  const [filter, setFilter] = useState('');

  const dispatch = useAppDispatch();
  const { threads = [], users = [], authUser } = useSelector(
    (state: RootState) => state
  );

  const categories = useMemo(() => {
    return Array.from(new Set(threads.map((thread) => thread.category)));
  }, [threads]);

  useEffect(() => {
    dispatch(asyncPopulateUsersAndThreads());
  }, [dispatch]);

  const handleUpVote = useCallback(
    (id: string) => dispatch(asyncUpVoteThread(id)),
    [dispatch]
  );

  const handleDownVote = useCallback(
    (id: string) => dispatch(asyncDownVoteThread(id)),
    [dispatch]
  );

  const handleNeutralVote = useCallback(
    (id: string) => dispatch(asyncNeturalizeVoteThread(id)),
    [dispatch]
  );

  const mergedThreads = useMemo(() => {
    return threads.map((thread) => ({
      ...thread,
      threadOwner: users.find((user) => user.id === thread.ownerId) ?? null,
      authUser: authUser?.id ?? '',
    }));
  }, [threads, users, authUser]);

  const filteredThreads = useMemo(() => {
    if (!filter) return mergedThreads;
    return mergedThreads.filter((thread) => thread.category === filter);
  }, [mergedThreads, filter]);

  return (
    <main className="max-w-3xl mx-auto px-4 pb-20">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded border ${filter === category
              ? 'bg-blue-600 text-white'
              : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
            onClick={() =>
              setFilter((prev) => (prev === category ? '' : category))
            }
          >
                        #{category}
          </button>
        ))}
      </div>

      {/* Threads List */}
      <ThreadsList
        threads={filteredThreads}
        upVote={handleUpVote}
        downVote={handleDownVote}
        neturalizeVote={handleNeutralVote}
      />

      {/* Floating Add Button */}
      <Link
        to="/new"
        className="fixed bottom-6 right-6 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        aria-label="Buat Thread Baru"
      >
                +
      </Link>
    </main>
  );
}
