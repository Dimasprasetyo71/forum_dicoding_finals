import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LeaderBoardItem from './LeaderBoardItem';
import { type User } from '../../types';
import '@testing-library/jest-dom';


describe('<LeaderBoardItem />', () => {
    const mockUser: User = {
        id: 'user-1',
        name: 'Jane Doe',
        avatar: 'https://example.com/avatar.jpg',
        email: ''
    };

    it('renders the user avatar, name, and score', () => {
        render(<LeaderBoardItem user={mockUser} score={42} />);

        // Avatar
        const avatar = screen.getByAltText('Jane Doe') as HTMLImageElement;
        expect(avatar).toBeInTheDocument();
        expect(avatar.src).toBe('https://example.com/avatar.jpg');

        // Name
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();

        // Score
        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('has correct structure and classes', () => {
        const { container } = render(<LeaderBoardItem user={mockUser} score={99} />);

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('flex', 'justify-between', 'items-center', 'py-3', 'border-b');
    });
});
