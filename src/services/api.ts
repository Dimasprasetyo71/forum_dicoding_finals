import type {
  RegisterPayload,
  LoginPayload,
  ThreadPayload,
  CommentPayload,
  CommentVotePayload,
  User,
  Thread,
  DetailThread,
  Comment,
  LeaderboardItem,
  ApiResponse,
} from '../types/index';

class CacheManager {
  private cache: Map<string, { data: unknown; timestamp: number }>;
  private cacheDuration: number;

  constructor(cacheDurationInMs: number = 5 * 60 * 1000) {
    this.cache = new Map();
    this.cacheDuration = cacheDurationInMs;
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() > item.timestamp + this.cacheDuration;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  invalidate(keyPattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (keyPattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

const api = (() => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const cacheManager = new CacheManager();
  const abortControllers: Map<string, AbortController> = new Map();

  function putAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
    cacheManager.clear();
  }

  function getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  async function _fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async function _fetchWithAbort<T>(
    url: string,
    fetchFn: () => Promise<Response>,
    cacheKey?: string
  ): Promise<T> {
    if (abortControllers.has(url)) {
      abortControllers.get(url)?.abort();
    }

    const controller = new AbortController();
    abortControllers.set(url, controller);

    try {
      if (cacheKey) {
        const cachedData = cacheManager.get<T>(cacheKey);
        if (cachedData) return cachedData;
      }

      const response = await fetchFn();
      const responseJson = (await response.json()) as ApiResponse<T>;
      const { status, message, data } = responseJson;

      if (status !== 'success') {
        throw new Error(message);
      }

      if (!data) {
        throw new Error('No data found');
      }

      if (cacheKey) {
        cacheManager.set(cacheKey, data);
      }

      return data;
    } finally {
      abortControllers.delete(url);
    }
  }

  // User Endpoints
  async function register({ name, email, password }: RegisterPayload){
    console.log('Registering user with:', { name, email, password });

    const res = await fetch('https://forum-api.dicoding.dev/v1/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Error response:', data);
      throw new Error(data.message || 'Failed to register');
    }

    return data.data.user;
  }


  async function login({ email, password }: LoginPayload): Promise<string> {
    const data = await _fetchWithAbort<{ token: string }>(
      `${BASE_URL}/login`,
      () =>
        fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
    );

    return data.token;
  }

  async function getAllUsers(): Promise<User[]> {
    const data = await _fetchWithAbort<{ users: User[] }>(
      `${BASE_URL}/users`,
      () => fetch(`${BASE_URL}/users`),
      'users'
    );

    return data.users;
  }

  async function getOwnProfile(): Promise<User> {
    const data = await _fetchWithAbort<{ user: User }>(
      `${BASE_URL}/users/me`,
      () => _fetchWithAuth(`${BASE_URL}/users/me`),
      'profile'
    );

    return data.user;
  }

  // Threads Endpoints
  async function createThread({
    title,
    body,
    category,
  }: ThreadPayload): Promise<Thread> {
    const data = await _fetchWithAbort<{ thread: Thread }>(
      `${BASE_URL}/threads`,
      () =>
        _fetchWithAuth(`${BASE_URL}/threads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, body, category }),
        })
    );

    cacheManager.invalidate(/^threads/);

    return data.thread;
  }

  async function seeAllThreads(): Promise<Thread[]> {
    const data = await _fetchWithAbort<{ threads: Thread[] }>(
      `${BASE_URL}/threads`,
      () => fetch(`${BASE_URL}/threads`),
      'threads'
    );

    return data.threads;
  }

  async function seeDetailThread(id: string): Promise<DetailThread> {
    const data = await _fetchWithAbort<{ detailThread: DetailThread }>(
      `${BASE_URL}/threads/${id}`,
      () => fetch(`${BASE_URL}/threads/${id}`),
      `thread-${id}`
    );

    return data.detailThread;
  }

  // Comments Endpoints
  async function createComment({
    threadId,
    content,
  }: CommentPayload): Promise<Comment> {
    const data = await _fetchWithAbort<{ comment: Comment }>(
      `${BASE_URL}/threads/${threadId}/comments`,
      () =>
        _fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        })
    );

    cacheManager.invalidate(new RegExp(`^thread-${threadId}`));

    return data.comment;
  }

  async function upVoteThread(threadId: string): Promise<{ voteType: string }> {
    // Optimistically update cache
    const cachedThread = cacheManager.get<DetailThread>(`thread-${threadId}`);
    if (cachedThread) {
      const userId = cacheManager.get<User>('profile')?.id;
      if (userId) {
        if (!cachedThread.upVotesBy.includes(userId)) {
          cachedThread.upVotesBy.push(userId);
        }
        cachedThread.downVotesBy = cachedThread.downVotesBy.filter(
          (id) => id !== userId
        );
        cacheManager.set(`thread-${threadId}`, cachedThread);
      }
    }

    const data = await _fetchWithAbort<{ vote: { voteType: string } }>(
      `${BASE_URL}/threads/${threadId}/up-vote`,
      () =>
        _fetchWithAuth(`${BASE_URL}/threads/${threadId}/up-vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
    );

    cacheManager.invalidate(new RegExp(`^thread-${threadId}`));
    cacheManager.invalidate(/^threads/);

    return data.vote;
  }

  async function downVoteThread(
    threadId: string
  ): Promise<{ voteType: string }> {
    // Optimistically update cache
    const cachedThread = cacheManager.get<DetailThread>(`thread-${threadId}`);
    if (cachedThread) {
      const userId = cacheManager.get<User>('profile')?.id;
      if (userId) {
        if (!cachedThread.downVotesBy.includes(userId)) {
          cachedThread.downVotesBy.push(userId);
        }
        cachedThread.upVotesBy = cachedThread.upVotesBy.filter(
          (id) => id !== userId
        );
        cacheManager.set(`thread-${threadId}`, cachedThread);
      }
    }

    const data = await _fetchWithAbort<{ vote: { voteType: string } }>(
      `${BASE_URL}/threads/${threadId}/down-vote`,
      () =>
        _fetchWithAuth(`${BASE_URL}/threads/${threadId}/down-vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
    );

    // Invalidate related caches
    cacheManager.invalidate(new RegExp(`^thread-${threadId}`));
    cacheManager.invalidate(/^threads/);

    return data.vote;
  }

  async function neutralizeVoteThread(
    threadId: string
  ): Promise<{ voteType: string }> {
    const cachedThread = cacheManager.get<DetailThread>(`thread-${threadId}`);
    if (cachedThread) {
      const userId = cacheManager.get<User>('profile')?.id;
      if (userId) {
        cachedThread.upVotesBy = cachedThread.upVotesBy.filter(
          (id) => id !== userId
        );
        cachedThread.downVotesBy = cachedThread.downVotesBy.filter(
          (id) => id !== userId
        );
        cacheManager.set(`thread-${threadId}`, cachedThread);
      }
    }

    const data = await _fetchWithAbort<{ vote: { voteType: string } }>(
      `${BASE_URL}/threads/${threadId}/neutral-vote`,
      () =>
        _fetchWithAuth(`${BASE_URL}/threads/${threadId}/neutral-vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
    );

    // Invalidate related caches
    cacheManager.invalidate(new RegExp(`^thread-${threadId}`));
    cacheManager.invalidate(/^threads/);

    return data.vote;
  }

  async function upVoteComment(commentId: any, {
    threadId,
  }: CommentVotePayload): Promise<{ voteType: string }> {
    // Optimistically update cache
    const cachedThread = cacheManager.get<DetailThread>(`thread-${threadId}`);
    if (cachedThread) {
      const userId = cacheManager.get<User>('profile')?.id;
      if (userId && cachedThread.comments) {
        const comment = cachedThread.comments.find((c) => c.id === commentId);
        if (comment) {
          if (!comment.upVotesBy.includes(userId)) {
            comment.upVotesBy.push(userId);
          }
          comment.downVotesBy = comment.downVotesBy.filter(
            (id) => id !== userId
          );
        }
        cacheManager.set(`thread-${threadId}`, cachedThread);
      }
    }

    const data = await _fetchWithAbort<{ vote: { voteType: string } }>(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
      () =>
        _fetchWithAuth(
          `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
    );

    cacheManager.invalidate(new RegExp(`^thread-${threadId}`));

    return data.vote;
  }

  async function downVoteComment({
    threadId,
    commentId,
  }: CommentVotePayload): Promise<{ voteType: string }> {
    const cachedThread = cacheManager.get<DetailThread>(`thread-${threadId}`);
    if (cachedThread) {
      const userId = cacheManager.get<User>('profile')?.id;
      if (userId && cachedThread.comments) {
        const comment = cachedThread.comments.find((c) => c.id === commentId);
        if (comment) {
          if (!comment.downVotesBy.includes(userId)) {
            comment.downVotesBy.push(userId);
          }
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
        }
        cacheManager.set(`thread-${threadId}`, cachedThread);
      }
    }

    const data = await _fetchWithAbort<{ vote: { voteType: string } }>(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
      () =>
        _fetchWithAuth(
          `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
    );

    cacheManager.invalidate(new RegExp(`^thread-${threadId}`));

    return data.vote;
  }

  async function neutralizeVoteComment({
    threadId,
    commentId,
  }: CommentVotePayload): Promise<{ voteType: string }> {
    const cachedThread = cacheManager.get<DetailThread>(`thread-${threadId}`);
    if (cachedThread) {
      const userId = cacheManager.get<User>('profile')?.id;
      if (userId && cachedThread.comments) {
        const comment = cachedThread.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
          comment.downVotesBy = comment.downVotesBy.filter(
            (id) => id !== userId
          );
        }
        cacheManager.set(`thread-${threadId}`, cachedThread);
      }
    }

    const data = await _fetchWithAbort<{ vote: { voteType: string } }>(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
      () =>
        _fetchWithAuth(
          `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
    );

    cacheManager.invalidate(new RegExp(`^thread-${threadId}`));

    return data.vote;
  }

  async function seeLeaderboards(): Promise<LeaderboardItem[]> {
    const data = await _fetchWithAbort<{ leaderboards: LeaderboardItem[] }>(
      `${BASE_URL}/leaderboards`,
      () => fetch(`${BASE_URL}/leaderboards`),
      'leaderboards'
    );

    return data.leaderboards;
  }

  function clearCache(): void {
    cacheManager.clear();
  }

  function abortAllRequests(): void {
    abortControllers.forEach((controller) => controller.abort());
    abortControllers.clear();
  }

  return {
    // Auth
    putAccessToken,
    getAccessToken,

    // User endpoints
    register,
    login,
    getAllUsers,
    getOwnProfile,

    // Thread endpoints
    createThread,
    seeAllThreads,
    seeDetailThread,

    // Comment endpoints
    createComment,

    // Vote endpoints
    upVoteThread,
    downVoteThread,
    neutralizeVoteThread,
    upVoteComment,
    downVoteComment,
    neutralizeVoteComment,

    // Leaderboard endpoints
    seeLeaderboards,

    // Cache utilities
    clearCache,
    abortAllRequests,
  };
})();

export default api;
