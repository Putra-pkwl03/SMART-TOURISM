'use client';

import { useEffect } from 'react';
import { apiClient } from '@/app/lib/axios';
import {
    expireAuthSession,
    extendAuthCookie,
    getAuthToken,
    getSessionTimeoutSeconds,
    setSessionTimeoutSeconds,
} from '@/app/lib/auth-session';

const MAX_SESSION_REFRESH_INTERVAL_MS = 5 * 60_000;

export default function SessionActivityMonitor() {
    useEffect(() => {
        let lastActivityAt = 0;
        let lastPersistedActivityAt = 0;
        let lastRefreshAt = 0;
        let refreshInProgress = false;
        let monitoring = false;
        let intervalId: number | undefined;
        let idleTimeout: number | undefined;
        let refreshTimeout: number | undefined;

        const getRefreshInterval = () =>
            Math.min(MAX_SESSION_REFRESH_INTERVAL_MS, getSessionTimeoutSeconds() * 1000 / 3);

        const stopMonitoring = () => {
            if (!monitoring) return;
            monitoring = false;
            window.clearInterval(intervalId);
            window.clearTimeout(idleTimeout);
            window.clearTimeout(refreshTimeout);
            intervalId = undefined;
            idleTimeout = undefined;
            refreshTimeout = undefined;
            activityEvents.forEach((event) => window.removeEventListener(event, recordActivity));
            document.removeEventListener('visibilitychange', checkSession);
            window.removeEventListener('focus', checkSession);
        };

        const sendActivity = async () => {
            if (refreshInProgress || !getAuthToken()) return;
            refreshInProgress = true;

            try {
                const response = await apiClient.post<{ expires_in?: number }>('/auth/activity');
                if (response.data.expires_in) {
                    setSessionTimeoutSeconds(response.data.expires_in);
                    extendAuthCookie();
                    scheduleIdleTimeout();
                }
                lastRefreshAt = Date.now();
            } catch (error) {
                console.error('Gagal memperbarui sesi aktif:', error);
            } finally {
                refreshInProgress = false;
            }
        };

        const scheduleIdleTimeout = () => {
            window.clearTimeout(idleTimeout);
            const remainingMs = getSessionTimeoutSeconds() * 1000 - (Date.now() - lastActivityAt);
            idleTimeout = window.setTimeout(checkSession, Math.max(0, remainingMs));
        };

        const checkSession = () => {
            if (!getAuthToken()) {
                stopMonitoring();
                return;
            }

            const storedActivity = Number(localStorage.getItem('auth_last_activity'));
            if (storedActivity > lastActivityAt) lastActivityAt = storedActivity;

            if (!lastActivityAt || Date.now() - lastActivityAt >= getSessionTimeoutSeconds() * 1000) {
                stopMonitoring();
                expireAuthSession();
                return;
            }

            scheduleIdleTimeout();

            if (
                document.visibilityState === 'visible'
                && Date.now() - lastRefreshAt >= getRefreshInterval()
                && Date.now() - lastActivityAt < getRefreshInterval()
            ) {
                void sendActivity();
            }
        };

        const recordActivity = (event: Event) => {
            if (!monitoring || !event.isTrusted || document.visibilityState !== 'visible' || !getAuthToken()) return;

            const now = Date.now();
            if (now - lastActivityAt >= getSessionTimeoutSeconds() * 1000) {
                stopMonitoring();
                expireAuthSession();
                return;
            }

            lastActivityAt = now;
            if (now - lastPersistedActivityAt >= 1000) {
                localStorage.setItem('auth_last_activity', String(now));
                lastPersistedActivityAt = now;
            }
            extendAuthCookie();
            scheduleIdleTimeout();

            if (now - lastRefreshAt >= getRefreshInterval()) {
                window.clearTimeout(refreshTimeout);
                refreshTimeout = window.setTimeout(() => void sendActivity(), 1000);
            }
        };

        const activityEvents: (keyof WindowEventMap)[] = [
            'pointerdown',
            'pointermove',
            'keydown',
            'scroll',
            'touchstart',
        ];

        const startMonitoring = () => {
            if (monitoring || !getAuthToken()) return;

            lastActivityAt = Number(localStorage.getItem('auth_last_activity')) || 0;
            lastPersistedActivityAt = lastActivityAt;

            if (!lastActivityAt || Date.now() - lastActivityAt >= getSessionTimeoutSeconds() * 1000) {
                expireAuthSession();
                return;
            }

            monitoring = true;
            activityEvents.forEach((event) => window.addEventListener(event, recordActivity, { passive: true }));
            document.addEventListener('visibilitychange', checkSession);
            window.addEventListener('focus', checkSession);
            intervalId = window.setInterval(checkSession, 30_000);
            checkSession();
        };

        const handleSessionStarted = () => {
            lastRefreshAt = 0;
            startMonitoring();
        };

        const handleSessionEnded = () => stopMonitoring();

        const handleStorage = (event: StorageEvent) => {
            if (event.key === 'auth_token') {
                if (event.newValue) {
                    handleSessionStarted();
                } else {
                    handleSessionEnded();
                    expireAuthSession(true);
                }
            } else if (event.key === 'auth_last_activity' && event.newValue) {
                lastActivityAt = Math.max(lastActivityAt, Number(event.newValue) || 0);
                if (monitoring) scheduleIdleTimeout();
            }
        };

        window.addEventListener('auth:session-started', handleSessionStarted);
        window.addEventListener('auth:session-ended', handleSessionEnded);
        window.addEventListener('storage', handleStorage);
        startMonitoring();

        return () => {
            stopMonitoring();
            window.removeEventListener('auth:session-started', handleSessionStarted);
            window.removeEventListener('auth:session-ended', handleSessionEnded);
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    return null;
}
