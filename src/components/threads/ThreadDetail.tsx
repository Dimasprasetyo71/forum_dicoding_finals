import parse from 'html-react-parser';
import VoteButton from '../button/VoteButton';
import  postedAt  from '../../utils/index';
import { type User } from './ThreadItem';

export interface ThreadDetailProps {
    id: string;
    title: string;
    body: string;
    owner: User;
    category: string;
    createdAt: string;
    authUser: string;
    threads: any[];
    upVote: (id: string) => Promise<void>;
    downVote: (id: string) => Promise<void>;
    neturalizeVote: (id: string) => Promise<void>;
    upVotesBy: string[];
    downVotesBy: string[];
    upVoteThreadDetail: (id: string) => void;
    downVoteThreadDetail: (id: string) => void;
    neturalizeVoteThreadDetail: (id: string) => void;
}

export interface ThreadsListProps {
    threads: any[];
    upVote: (id: string) => Promise<void>;
    downVote: (id: string) => Promise<void>;
    neturalizeVote: (id: string) => Promise<void>;
}

export default function ThreadDetail({
  id,
  title,
  body,
  owner,
  category,
  createdAt,
  authUser,
  upVotesBy,
  downVotesBy,
  upVoteThreadDetail,
  downVoteThreadDetail,
  neturalizeVoteThreadDetail,

}: ThreadDetailProps) {
  // Function to get category color
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

  return (
    <article className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mb-6">
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />

      {/* Header Section */}
      <header className="p-6 pb-4">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase ${getCategoryColor(category)}`}>
            <span className="w-2 h-2 bg-current rounded-full mr-2 opacity-70" />
            {category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
          {title}
        </h1>
      </header>

      {/* Content Section */}
      <section className="px-6 pb-6">
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100">
          {parse(body)}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="p-6">
          {/* Vote Section */}
          <div className="flex items-center justify-between mb-4">
            <VoteButton
              id={id}
              authUser={authUser}
              upVote={upVoteThreadDetail}
              downVote={downVoteThreadDetail}
              neturalizeVote={neturalizeVoteThreadDetail}
              upVotesBy={upVotesBy}
              downVotesBy={downVotesBy}
            />
          </div>

          {/* Author & Date Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
            {/* Author */}
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-500 mr-3">Dibuat oleh</span>
              <div className="flex items-center bg-white dark:bg-gray-700 rounded-full pr-3 py-1 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200">
                <img
                  src={owner.avatar}
                  alt={`Avatar ${owner.name}`}
                  className="w-8 h-8 rounded-full mr-3 ring-2 ring-white dark:ring-gray-700 object-cover"
                  loading="lazy"
                />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {owner.name}
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-gray-400"
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
              <time
                dateTime={createdAt}
                className="text-gray-500 dark:text-gray-400 font-medium"
              >
                {postedAt(createdAt)}
              </time>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}