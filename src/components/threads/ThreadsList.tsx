import ThreadItem, { type ThreadItemProps } from './ThreadItem';

interface ThreadsListProps {
  threads: ThreadItemProps[];
  upVote: (id: string) => void;
  downVote: (id: string) => void;
  neturalizeVote: (id: string) => void;
}

export default function ThreadsList({
  threads,
  upVote,
  downVote,
  neturalizeVote,
}: ThreadsListProps) {
  return (
    <>
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          {...thread}
          upVote={upVote}
          downVote={downVote}
          neturalizeVote={neturalizeVote}
        />
      ))}
    </>
  );
}
