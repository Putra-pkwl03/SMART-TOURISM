const DEFAULT_PRODUCTION_BACKEND_URL = 'https://smartmdl.com';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);

const withoutTrailingSlash = (url: string) => url.replace(/\/+$/, '');

const isLocalUrl = (url: string) => {
    try {
        return LOCAL_HOSTNAMES.has(new URL(url).hostname);
    } catch {
        return false;
    }
};

const getConfiguredProductionBackendUrl = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (backendUrl && !isLocalUrl(backendUrl)) {
        return withoutTrailingSlash(backendUrl);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl && !isLocalUrl(apiUrl)) {
        return withoutTrailingSlash(apiUrl.replace(/\/api\/?$/, ''));
    }

    return DEFAULT_PRODUCTION_BACKEND_URL;
};

export const getBackendUrl = () => {
    if (typeof window !== 'undefined' && LOCAL_HOSTNAMES.has(window.location.hostname)) {
        return `${window.location.protocol}//${window.location.hostname}:8000`;
    }

    if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        return backendUrl && isLocalUrl(backendUrl)
            ? withoutTrailingSlash(backendUrl)
            : 'http://127.0.0.1:8000';
    }

    return getConfiguredProductionBackendUrl();
};

export const getApiUrl = () => {
    if (typeof window !== 'undefined' && LOCAL_HOSTNAMES.has(window.location.hostname)) {
        return `${getBackendUrl()}/api`;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl && !isLocalUrl(apiUrl)) {
        return withoutTrailingSlash(apiUrl);
    }

    return `${getBackendUrl()}/api`;
};