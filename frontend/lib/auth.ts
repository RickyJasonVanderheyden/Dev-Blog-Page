const USER_KEY = 'blog_user';
const LOGOUT_FLAG = 'blog_logged_out';

export const authUtils = {
  // Token is now handled via HTTP-only cookies, so these methods are simplified
  getToken: (): string | null => {
    // Tokens are in HTTP-only cookies and can't be accessed from JavaScript
    return null;
  },
  setToken: (token: string): void => {
    // Token is set via HTTP-only cookie from server
    // Clear any explicit logout flag when login is successful
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOGOUT_FLAG);
    }
  },
  removeToken: (): void => {
    // Token removal is handled by server clearing the cookie
    // We just clear user data and set logout flag
    if (typeof window === 'undefined') return;
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
    // Since we can't check the HTTP-only cookie from JavaScript,
    // we'll rely on the user data being present (set after successful login)
    // and the absence of a logout flag
    return !!authUtils.getUser() && !authUtils.getLogoutFlag();
  },
};


