import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  asyncReceiveThreadDetail,
  asyncUpVoteThreadDetail,
  asyncDownVoteThreadDetail,
  asyncNeutralizeVoteThreadDetail,
  asyncCreateComment,
  asyncUpVoteComment,
  asyncDownVoteComment,
  asyncNeutralizeVoteComment,
} from '../features/threads/Detail/action';
import ThreadDetail from '../components/threads/ThreadDetail';
import CommentInput from '../components/comments/CommentInput';
import CommentsList from '../components/comments/CommentsList';
import NotFoundPage from './NotFoundPage';
import { useAppDispatch } from '../store/hooks';

interface RootState {
    threadDetail: any;
    authUser: { id: string };
}

export default function DetailPage() {
  const { threadId } = useParams<{ threadId: string }>();

  const { threadDetail = null, authUser } = useSelector(
    (state: RootState) => state
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (threadId) {
      dispatch(asyncReceiveThreadDetail(threadId));
    }
  }, [threadId, dispatch]);

  const onUpVoteThreadDetail = () => {
    dispatch(asyncUpVoteThreadDetail());
  };

  const onDownVoteThreadDetail = () => {
    dispatch(asyncDownVoteThreadDetail());
  };

  const onNeturalizeVoteThreadDetail = () => {
    dispatch(asyncNeutralizeVoteThreadDetail());
  };

  const onCommentSubmit = (content: string) => {
    dispatch(asyncCreateComment({ content }));
  };

  const onUpVoteComment = (id: string) => {
    dispatch(asyncUpVoteComment(id));
  };

  const onDownVoteComment = (id: string) => {
    dispatch(asyncDownVoteComment(id));
  };

  const onNeturalizeVoteComment = (id: string) => {
    dispatch(asyncNeutralizeVoteComment(id));
  };

  if (threadDetail === null) {
    return <NotFoundPage />;
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 mb-8 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <div className="px-4 py-4 border-b">
        <ThreadDetail
          {...threadDetail}
          authUser={authUser.id}
          upVoteThreadDetail={onUpVoteThreadDetail}
          downVoteThreadDetail={onDownVoteThreadDetail}
          neturalizeVoteThreadDetail={onNeturalizeVoteThreadDetail}
        />
      </div>
      <div className="px-4 py-4 border-b">
        <CommentInput addComment={onCommentSubmit} />
      </div>
      <div className="px-4 py-4 border-b">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Komentar ({threadDetail.comments.length})
        </h2>
      </div>
      <div className="px-4 py-4">
        <CommentsList
          comments={threadDetail.comments}
          authUser={authUser.id}
          upVoteComment={onUpVoteComment}
          downVoteComment={onDownVoteComment}
          neturalizeVoteComment={onNeturalizeVoteComment}
        />
      </div>
    </div>
  );
}
