import parse from 'html-react-parser';
import VoteButton from '../button/VoteButton';
import  postedAt  from '../../utils/index';
import { type User } from '../threads/ThreadItem';

export interface CommentItemProps {
    id: string;
    content: string;
    createdAt: string;
    owner: User;
    upVotesBy: string[];
    downVotesBy: string[];
    upVote: (id: string) => void;
    downVote: (id: string) => void;
    neturalizeVote: (id: string) => void;
    authUser: string;
}

export default function CommentItem({
  id,
  content,
  createdAt,
  owner,
  upVotesBy,
  downVotesBy,
  upVote,
  downVote,
  neturalizeVote,
  authUser,
}: CommentItemProps) {
  return (
    <article className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300 mb-4">
      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-pink-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

      <div className="relative p-4 sm:p-5">
        {/* Header with author info and timestamp */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          {/* Author info */}
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <img
                src={owner.avatar}
                alt={`Avatar ${owner.name}`}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-sm"
                loading="lazy"
              />
              {/* Online indicator (optional) */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white dark:ring-gray-800 opacity-75" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {owner.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                {postedAt(createdAt)}
              </p>
            </div>
          </div>

          {/* Timestamp for larger screens */}
          <div className="hidden sm:flex items-center text-xs text-gray-500 dark:text-gray-400">
            <svg
              className="w-3.5 h-3.5 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <time dateTime={createdAt}>
              {postedAt(createdAt)}
            </time>
          </div>
        </header>

        {/* Content */}
        <section className="mb-4">
          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800">
            {parse(content)}
          </div>
        </section>

        {/* Footer with actions */}
        <footer className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          {/* Vote buttons */}
          <div className="flex items-center">
            <VoteButton
              id={id}
              authUser={authUser}
              upVote={upVote}
              downVote={downVote}
              neturalizeVote={neturalizeVote}
              upVotesBy={upVotesBy}
              downVotesBy={downVotesBy}
            />
          </div>

          {/* Additional actions (optional) */}
          <div className="flex items-center space-x-2">
            {/* Reply button */}
            <button
              className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all duration-200"
              onClick={() => {
                // Handle reply functionality
                console.log('Reply to comment:', id);
              }}
            >
              <svg
                className="w-3.5 h-3.5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
                            Balas
            </button>

            {/* More options */}
            {authUser === owner.id && (
              <button
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
                onClick={() => {
                  // Handle more options (edit, delete, etc.)
                  console.log('More options for comment:', id);
                }}
                aria-label="Opsi lainnya"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}