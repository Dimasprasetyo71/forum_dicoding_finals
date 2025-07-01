import {  type User } from '../threads/ThreadItem';

export interface LeaderBoardItemProps {
    user: User;
    score: number;
}

export default function LeaderBoardItem({ user, score }: LeaderBoardItemProps) {
  return (
    <div className="flex justify-between items-center py-3 border-b">
      <div className="flex items-center space-x-3 ml-2">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-base font-medium text-gray-800 dark:text-gray-200">
          {user.name}
        </span>
      </div>
      <span className="text-base font-medium text-gray-800 dark:text-gray-200 mr-4">
        {score}
      </span>
    </div>
  );
}
