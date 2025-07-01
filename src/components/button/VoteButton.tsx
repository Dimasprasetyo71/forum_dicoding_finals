import PropTypes from 'prop-types';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export type VoteButtonProps = {
    id: string;
    upVote: (id: string) => void;
    downVote: (id: string) => void;
    neturalizeVote: (id: string) => void;
    upVotesBy: string[];
    downVotesBy: string[];
    authUser: string;
}

export default function VoteButton({
  id,
  upVote,
  downVote,
  neturalizeVote,
  upVotesBy,
  downVotesBy,
  authUser,
}: VoteButtonProps) {
  const isUpVoted = upVotesBy.includes(authUser);
  const isDownVoted = downVotesBy.includes(authUser);

  const onUpVoteClick = () => {
    if (isUpVoted) {
      neturalizeVote(id);
    } else {
      upVote(id);
    }
  };

  const onDownVoteClick = () => {
    if (isDownVoted) {
      neturalizeVote(id);
    } else {
      downVote(id);
    }
  };

  return (
    <div className="inline-flex items-stretch p-1 transform rotate-1 hover:rotate-0 transition-transform duration-200">
      {/* Upvote Section */}
      <div className="flex items-center bg-white border-r-4 border-black">
        <button
          onClick={onUpVoteClick}
          className={`
            group relative p-3 border-4 border-black transition-all duration-150 
            hover:scale-105 active:scale-95 active:translate-x-1 active:translate-y-1
            ${isUpVoted
      ? 'bg-gradient-to-br from-lime-300 to-green-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
      : 'bg-gradient-to-br from-yellow-200 to-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:from-yellow-300 hover:to-yellow-500'
    }
          `}
        >
          <ThumbsUp
            size={24}
            strokeWidth={3}
            className={`
              transition-all duration-200 group-hover:rotate-12
              ${isUpVoted ? 'text-black fill-current animate-pulse' : 'text-black group-hover:text-gray-800'}
            `}
          />
          {isUpVoted && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 border-2 border-black rounded-full animate-bounce"></div>
          )}
        </button>

        <div className={`
          px-4 py-3 border-4 border-l-0 border-black font-black text-xl relative overflow-hidden
          ${upVotesBy.length > 0
      ? 'bg-gradient-to-r from-green-200 to-green-300 text-green-900'
      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600'
    }
        `}>
          <div className="relative z-10 min-w-[2rem] text-center">
            {upVotesBy.length}
          </div>
          {upVotesBy.length > 0 && (
            <div className="absolute inset-0 bg-green-400 opacity-20 animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Middle Separator with Icon */}
      <div className="flex items-center justify-center bg-black w-12 ">
        <div className="w-2 h-2 bg-white transform rotate-45 animate-spin"></div>
      </div>

      {/* Downvote Section */}
      <div className="flex items-center bg-white border-l-4 border-black">
        <div className={`
          px-4 py-3 border-4 border-r-0 border-black font-black text-xl relative overflow-hidden
          ${downVotesBy.length > 0
      ? 'bg-gradient-to-l from-red-200 to-red-300 text-red-900'
      : 'bg-gradient-to-l from-gray-100 to-gray-200 text-gray-600'
    }
        `}>
          <div className="relative z-10 min-w-[2rem] text-center">
            {downVotesBy.length}
          </div>
          {downVotesBy.length > 0 && (
            <div className="absolute inset-0 bg-red-400 opacity-20 animate-pulse"></div>
          )}
        </div>

        <button
          onClick={onDownVoteClick}
          className={`
            group relative p-3 border-4 border-black transition-all duration-150 
            hover:scale-105 active:scale-95 active:translate-x-1 active:translate-y-1
            ${isDownVoted
      ? 'bg-gradient-to-br from-red-300 to-red-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
      : 'bg-gradient-to-br from-blue-200 to-blue-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:from-blue-300 hover:to-blue-500'
    }
          `}
        >
          <ThumbsDown
            size={24}
            strokeWidth={3}
            className={`
              transition-all duration-200 group-hover:-rotate-12
              ${isDownVoted ? 'text-black fill-current animate-pulse' : 'text-black group-hover:text-gray-800'}
            `}
          />
          {isDownVoted && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 border-2 border-black rounded-full animate-bounce"></div>
          )}
        </button>
      </div>
    </div>
  );
}

VoteButton.propTypes = {
  id: PropTypes.string.isRequired,
  upVote: PropTypes.func.isRequired,
  downVote: PropTypes.func.isRequired,
  neturalizeVote: PropTypes.func.isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  authUser: PropTypes.string.isRequired,
};