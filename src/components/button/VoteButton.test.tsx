import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VoteButton, { type VoteButtonProps } from './VoteButton';
import '@testing-library/jest-dom';
describe('<VoteButton />', () => {
  const baseProps: VoteButtonProps = {
    id: 'thread-1',
    upVote: vi.fn(),
    downVote: vi.fn(),
    neturalizeVote: vi.fn(),
    upVotesBy: [],
    downVotesBy: [],
    authUser: 'user-1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upvote and downvote counts', () => {
    render(<VoteButton {...baseProps} upVotesBy={['a', 'b']} downVotesBy={['c']} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calls upVote when upvote button is clicked and not yet voted', () => {
    render(<VoteButton {...baseProps} />);

    const upvoteButton = screen.getAllByRole('button')[0];
    fireEvent.click(upvoteButton);

    expect(baseProps.upVote).toHaveBeenCalledWith('thread-1');
    expect(baseProps.neturalizeVote).not.toHaveBeenCalled();
  });

  it('calls neturalizeVote when upvote button is clicked and already upvoted', () => {
    render(<VoteButton {...baseProps} upVotesBy={['user-1']} />);

    const upvoteButton = screen.getAllByRole('button')[0];
    fireEvent.click(upvoteButton);

    expect(baseProps.neturalizeVote).toHaveBeenCalledWith('thread-1');
    expect(baseProps.upVote).not.toHaveBeenCalled();
  });

  it('calls downVote when downvote button is clicked and not yet voted', () => {
    render(<VoteButton {...baseProps} />);

    const downvoteButton = screen.getAllByRole('button')[1];
    fireEvent.click(downvoteButton);

    expect(baseProps.downVote).toHaveBeenCalledWith('thread-1');
    expect(baseProps.neturalizeVote).not.toHaveBeenCalled();
  });

  it('calls neturalizeVote when downvote button is clicked and already downvoted', () => {
    render(<VoteButton {...baseProps} downVotesBy={['user-1']} />);

    const downvoteButton = screen.getAllByRole('button')[1];
    fireEvent.click(downvoteButton);

    expect(baseProps.neturalizeVote).toHaveBeenCalledWith('thread-1');
    expect(baseProps.downVote).not.toHaveBeenCalled();
  });
});
