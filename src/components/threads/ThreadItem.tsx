import { useNavigate } from 'react-router-dom';
import VoteButton from '../button/VoteButton';
import  postedAt  from '../../utils/index';
import PropTypes from 'prop-types';

export interface User {
    id: string;
    name: string;
    email?: string;
    avatar: string;
}

export interface ThreadItemProps {
    id: string;
    title: string;
    body: string;
    category: string;
    createdAt: string;
    upVotesBy: string[];
    downVotesBy: string[];
    totalComments: number;
    threadOwner: User;
    authUser: string;
    upVote: (id: string) => void;
    downVote: (id: string) => void;
    neturalizeVote: (id: string) => void;
}

export default function ThreadItem({
  id,
  title,
  body,
  category,
  createdAt,
  upVotesBy,
  downVotesBy,
  totalComments,
  upVote,
  downVote,
  neturalizeVote,
  threadOwner,
  authUser,
}: ThreadItemProps) {
  const navigate = useNavigate();

  const onThreadClick = () => {
    navigate(`/thread/${id}`);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'teknologi': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'olahraga': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'politik': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'ekonomi': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'hiburan': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'kesehatan': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    };
    return colors[category.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)  }...`;
  };

  const getPlainText = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  return (
    <article className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 mb-4">
      {/* Subtle gradient hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Clickable content area */}
      <div
        className="relative p-6 cursor-pointer"
        onClick={onThreadClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onThreadClick();
          }
        }}
        aria-label={`Buka thread: ${title}`}
      >
        {/* Header with category and title */}
        <header className="mb-4">
          {/* Category Badge */}
          <div className="mb-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium tracking-wide uppercase ${getCategoryColor(category)}`}>
              <span className="w-1.5 h-1.5 bg-current rounded-full mr-1.5 opacity-70" />
              {category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {title}
          </h2>
        </header>

        {/* Body Preview */}
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            {truncateText(getPlainText(body))}
          </p>
        </div>

        {/* Read more indicator */}
        <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>Baca selengkapnya</span>
          <svg
            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Footer with interactions */}
      <footer className="relative border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          {/* Left side - Vote and Comments */}
          <div className="flex items-center gap-6">
            {/* Vote Button */}
            <VoteButton
              id={id}
              authUser={authUser}
              upVote={upVote}
              downVote={downVote}
              neturalizeVote={neturalizeVote}
              upVotesBy={upVotesBy}
              downVotesBy={downVotesBy}
            />

            {/* Comments */}
            <div className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="font-medium">
                {totalComments} {totalComments === 1 ? 'komentar' : 'komentar'}
              </span>
            </div>
          </div>

          {/* Right side - Author and Date */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
            {/* Author */}
            <div className="flex items-center">
              <img
                src={threadOwner.avatar}
                alt={`Avatar ${threadOwner.name}`}
                className="w-6 h-6 rounded-full mr-2 ring-2 ring-white dark:ring-gray-700 object-cover"
                loading="lazy"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {threadOwner.name}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <svg
                className="w-3.5 h-3.5 mr-1.5 sm:mr-2"
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
              <time dateTime={createdAt} className="text-xs sm:text-sm">
                {postedAt(createdAt)}
              </time>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}

ThreadItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  upVotesBy: PropTypes.array.isRequired,
  downVotesBy: PropTypes.array.isRequired,
  totalComments: PropTypes.number.isRequired,
  threadOwner: PropTypes.object.isRequired,
  authUser: PropTypes.string.isRequired,
  upVote: PropTypes.func.isRequired,
  downVote: PropTypes.func.isRequired,
  neturalizeVote: PropTypes.func.isRequired,
};