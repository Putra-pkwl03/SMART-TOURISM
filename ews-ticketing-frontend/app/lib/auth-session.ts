import { toast } from 'sonner';

export const DEFAULT_SESSION_TIMEOUT_SECONDS = 30 * 60;
const SESSION_TIMEOUT_KEY = 'session_expires_in';
const ROLE_COOKIE = 'user_role';
const TOKEN_COOKIE = 'auth_token';

type AuthUser = {
    role: string;
};

const getCookieAttributes = (maxAge: number) =>
    `path=/; max-age=${maxAge}; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;

export const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token') || localStorage.getItem('token');
};

export const getSessionTimeoutSeconds = () => {
    if (typeof window === 'undefined') return DEFAULT_SESSION_TIMEOUT_SECONDS;
    return Number(localStorage.getItem(SESSION_TIMEOUT_KEY)) || DEFAULT_SESSION_TIMEOUT_SECONDS;
}

export const setSessionTimeoutSeconds = (expiresIn: number) => {
    if (typeof window === 'undefined' || !Number.isFinite(expiresIn) || expiresIn <= 0) return;
    localStorage.setItem(SESSION_TIMEOUT_KEY, String(expiresIn));
}

export const persistAuthSession = (token: string, user: AuthUser, expiresIn = DEFAULT_SESSION_TIMEOUT_SECONDS) => {
    const maxAge = Math.max(1, expiresIn);
    resetSessionExpirationHandling();
    localStorage.setItem('auth_token', token);
    localStorage.setItem('token', token);
    localStorage.setItem('user_role', user.role);
    setSessionTimeoutSeconds(maxAge);
    localStorage.setItem('auth_last_activity', String(Date.now()));
    localStorage.setItem('user', JSON.stringify(user));
    document.cookie = `${TOKEN_COOKIE}=${token}; ${getCookieAttributes(maxAge)}`;
    document.cookie = `${ROLE_COOKIE}=${user.role}; ${getCookieAttributes(maxAge)}`;
    window.dispatchEvent(new Event('auth:session-started'));
}

export const extendAuthCookie = () => {
    if (typeof window === 'undefined') return;

    const token = getAuthToken();
    const role = localStorage.getItem('user_role');
    if (!token || !role) return;

    const maxAge = Number(localStorage.getItem(SESSION_TIMEOUT_KEY)) || DEFAULT_SESSION_TIMEOUT_SECONDS;
    const attributes = getCookieAttributes(maxAge);
    document.cookie = `${TOKEN_COOKIE}=${token}; ${attributes}`;
    document.cookie = `${ROLE_COOKIE}=${role}; ${attributes}`;
}

export const clearAuthSession = () => {
    if (typeof window === 'undefined') return;

    for (const key of ['auth_token', 'token', 'user', 'user_role', SESSION_TIMEOUT_KEY, 'auth_last_activity']) {
        localStorage.removeItem(key);
    }

    document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    window.dispatchEvent(new Event('auth:session-ended'));
}

let expirationHandled = false;

export const expireAuthSession = (force = false) => {
    if (typeof window === 'undefined' || expirationHandled || (!force && !getAuthToken())) return;

    expirationHandled = true;
    clearAuthSession();
    window.dispatchEvent(new Event('auth:session-expired'));
    toast.error('Sesi Anda berakhir. Silakan masuk kembali.');

    const pathname = window.location.pathname;
    if (pathname.startsWith('/dashboard')) {
        window.location.replace('/auth/login');
    } else if (pathname.startsWith('/tickets/history') || pathname.startsWith('/user/profile')) {
        window.location.replace('/auth/users/login');
    }
}

export const resetSessionExpirationHandling = () => {
    expirationHandled = false;
}
