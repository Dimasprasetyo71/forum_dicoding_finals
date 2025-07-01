import CommentItem, { type CommentItemProps } from './CommentItem';

interface CommentsListProps {
    comments: CommentItemProps[];
    authUser: string;
    upVoteComment: (id: string) => void;
    downVoteComment: (id: string) => void;
    neturalizeVoteComment: (id: string) => void;
}

export default function CommentsList({
  comments,
  authUser,
  upVoteComment,
  downVoteComment,
  neturalizeVoteComment,
}: CommentsListProps) {
  return (
    <>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          {...comment}
          authUser={authUser}
          upVote={upVoteComment}
          downVote={downVoteComment}
          neturalizeVote={neturalizeVoteComment}
        />
      ))}
    </>
  );
}
