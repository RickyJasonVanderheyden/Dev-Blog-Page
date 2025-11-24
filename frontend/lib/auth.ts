const TOKEN_KEY = 'blog_auth_token';
const USER_KEY = 'blog_user';
const LOGOUT_FLAG = 'blog_logged_out';

export const authUtils = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    // clear any explicit logout flag when token is set
    localStorage.removeItem(LOGOUT_FLAG);
  },
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // mark that the user explicitly logged out to prevent accidental auto-login
    try {
      localStorage.setItem(LOGOUT_FLAG, Date.now().toString());
    } catch (_e) {}
  },
  getUser: (): any | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // clear logout flag on explicit login
    localStorage.removeItem(LOGOUT_FLAG);
  },
  getLogoutFlag: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LOGOUT_FLAG);
  },
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },
};


