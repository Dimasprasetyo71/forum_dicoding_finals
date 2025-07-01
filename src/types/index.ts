import type { ReactNode } from 'react';


/* ------------------ User & Auth ------------------ */
export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    name: string;
    password: string;
}

/* ------------------ Thread & Comment ------------------ */
export interface Thread {
    id: string;
    title: string;
    body: string;
    category: string;
    createdAt: string;
    ownerId: string;
    upVotesBy: string[];
    downVotesBy: string[];
    totalComments: number;
    owner?: User;
}

export interface DetailThread extends Thread {
    comments: Comment[];
}



export type ThreadDetail = {
    id: string;
    title: string;
    body: string;
    category: string;
    createdAt: string;
    owner?: { id: string; name: string; avatar: string; } | undefined;

    upVotesBy: string[];
    downVotesBy: string[];
    comments: Comment[];
};

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    owner: User;
    upVotesBy: string[];
    downVotesBy: string[];
}

/* ------------------ Payloads ------------------ */
export interface ThreadPayload {
    title: string;
    body: string;
    category: string;
}

export interface CommentPayload {
    threadId: any;
    content: any;
}

export interface CommentVotePayload {
    threadId: string;
    commentId: string;
}

/* ------------------ Misc ------------------ */
export interface LeaderboardItem {
    user: User;
    score: number;
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

/* ------------------ Context ------------------ */
export interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

export interface ThemeProviderProps {
    children: ReactNode;
    value?: string;
}

export interface LocaleContextType {
    locale: string;
    toggleLocale: () => void;
}

export interface LocaleProviderProps {
    children: ReactNode;
    value?: string;
}

/* ------------------ SEO / Props ------------------ */
export interface Props {
    title: string;
    description: string;
    image?: string;
}

/* ------------------ Register ------------------ */
export interface RegisterParams {
    name: string;
    email: string;
    password: string;
}

/* ------------------ Error ------------------ */
export type ErrorState = {
    email?: string;
    name?: string;
    password?: string;
    general?: string;
};


/* ------------------ RegisterINPUT ------------------ */
export interface RegisterInputProps {
    register: (data: { name: string; email: string; password: string }) => void
    name: string
    email: string
    password: string
    errors?: {
        name?: string;
        email?: string;
        password?: string;
        [key: string]: string | undefined;
    }
    disabled?: boolean
    checkEmailExists?: (email: string) => Promise<boolean>
    onPasswordChange?: (password: string) => void
}

/* ------------------ RegisterPARAMS ------------------ */
export interface RegisterParams {
    name: string;
    email: string;
    password: string;
}


export interface Leaderboard {
    user: User;
    score: number;
}

export interface LeaderboardsState {
    data: Leaderboard[];
    loading: boolean;
    error: string | null;

}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

export interface AuthState {
    authUser: AuthUser | null;
    loading: boolean;
    error: string | null;
}



export interface Thread {
    id: string;
    title: string;
    body: string;
    category: string;
    createdAt: string;
    ownerId: string;
    upVotesBy: string[];
    downVotesBy: string[];
}

export interface ThreadsState {
    data: Thread[];
    loading: boolean;
    error: string | null;
}

