import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import { fetchTMDBGenres } from './fetchTMDBGenres';
import BASE_URL, { endpoints } from '../routes/api';

const StoreContext = createContext(null);

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch { }
    }, [key, storedValue]);
    return [storedValue, setStoredValue];
}

const StoreProvider = ({ children }) => {
    const [token, setToken] = useLocalStorage('cinaverse_token', null);
    const [user, setUser] = useLocalStorage('cinaverse_user', null);
    const [activeChildId, setActiveChildId] = useLocalStorage('cinaverse_child_id', null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [genres, setGenres] = useState([]);
    const [childProfiles, setChildProfiles] = useState([]);
    const [dataCache, setDataCache] = useState({});

    // Derive authentication state
    const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

    // Fetch genres on mount
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await fetch(endpoints.movies.genres);
                if (!res.ok) throw new Error();
                const data = await res.json();
                if (mounted) setGenres(data.genres || []);
            } catch {
                if (mounted) setGenres([]);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const authHeader = React.useCallback(() => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, [token]);

    const request = React.useCallback(async (url, options = {}, expectJson = true) => {
        setError(null);
        const headers = {
            'Content-Type': 'application/json',
            ...authHeader(),
            ...(activeChildId ? { 'x-child-id': activeChildId } : {}),
            ...(options.headers || {}),
        };

        const res = await fetch(url, { ...options, headers });

        if (!res.ok) {
            let errMsg = `HTTP ${res.status}`;
            try {
                const data = await res.json();
                errMsg = data?.message || errMsg;
            } catch { }
            throw new Error(errMsg);
        }

        if (!expectJson) return res;
        return res.json();
    }, [authHeader, activeChildId]);

    // Auth Actions
    const login = React.useCallback(async ({ email, password, remember = true }) => {
        setLoading(true);
        try {
            const data = await request(endpoints.auth.login, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            const accessToken = data?.access_token;
            const profile = data?.user;
            if (!accessToken) throw new Error('No access token received');

            setToken(accessToken);
            if (!remember) sessionStorage.setItem('cinaverse_token', accessToken);
            if (profile) setUser(profile);

            // Load children in background if parent
            if (profile?.role === 'parent') {
                request(endpoints.childProfiles.list).then(c => setChildProfiles(c || [])).catch(() => { });
            }

            return { token: accessToken, user: profile };
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [request, setToken, setUser]);

    const register = React.useCallback(async ({ email, password, firstName, lastName }) => {
        setLoading(true);
        try {
            await request(endpoints.auth.register, {
                method: 'POST',
                body: JSON.stringify({ email, password, firstName, lastName }),
            });
            return await login({ email, password });
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [request, login]);

    const logout = React.useCallback(async () => {
        setToken(null);
        setUser(null);
        setActiveChildId(null);
        setChildProfiles([]);
        try { sessionStorage.removeItem('cinaverse_token'); } catch { }
        request(endpoints.auth.logout, { method: 'POST' }).catch(() => { });
    }, [request, setActiveChildId, setToken, setUser]);

    const updateProfile = React.useCallback(async (updates) => {
        const profile = await request(endpoints.users.profile, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
        setUser(profile);
        return profile;
    }, [request, setUser]);

    // Cache Helper
    const pendingRequests = React.useRef(new Map());

    // Cache Helper with Request Deduplication
    const getCacheOrFetch = React.useCallback(async (key, fetcher) => {
        if (dataCache[key]) return dataCache[key];

        if (pendingRequests.current.has(key)) {
            return pendingRequests.current.get(key);
        }

        const promise = (async () => {
            try {
                const data = await fetcher();
                setDataCache(prev => ({ ...prev, [key]: data }));
                return data;
            } finally {
                pendingRequests.current.delete(key);
            }
        })();

        pendingRequests.current.set(key, promise);
        return promise;
    }, [dataCache]);

    // Movie Actions
    const searchMovies = React.useCallback(async (q) => request(endpoints.movies.search(q)), [request]);
    const getTrendingMovies = React.useCallback(() => getCacheOrFetch('trending', () => request(endpoints.movies.trending)), [getCacheOrFetch, request]);
    const getPopularMovies = React.useCallback(() => getCacheOrFetch('popular', () => request(endpoints.movies.popular)), [getCacheOrFetch, request]);
    const getLatestMovies = React.useCallback(() => getCacheOrFetch('latest', () => request(endpoints.movies.latest)), [getCacheOrFetch, request]);
    const getMovieDetails = React.useCallback((id) => getCacheOrFetch(`movie_${id}`, () => request(endpoints.movies.details(id))), [getCacheOrFetch, request]);
    const getMovieTrailer = React.useCallback((id) => getCacheOrFetch(`trailer_${id}`, () => request(endpoints.movies.trailer(id))), [getCacheOrFetch, request]);
    const getSimilarMovies = React.useCallback((id) => request(endpoints.movies.similar(id)), [request]);

    // Watchlist
    const [watchlistCache, setWatchlistCache] = useState({ data: null, timestamp: 0 });
    const WATCHLIST_TTL = 60000;

    const getWatchlist = React.useCallback(async (force = false) => {
        if (!force && watchlistCache.data && (Date.now() - watchlistCache.timestamp < WATCHLIST_TTL)) return watchlistCache.data;
        const data = await request(endpoints.watchlist.list);
        setWatchlistCache({ data, timestamp: Date.now() });
        return data;
    }, [request, watchlistCache]);

    const addToWatchlist = React.useCallback(async (movieId, status = 'pending', category = '') => {
        const res = await request(endpoints.watchlist.add, {
            method: 'POST',
            body: JSON.stringify({ movieId: String(movieId), status, category }),
        });
        setWatchlistCache({ data: null, timestamp: 0 });
        return res;
    }, [request]);

    const removeFromWatchlist = React.useCallback(async (id) => {
        const res = await request(endpoints.watchlist.remove(id), { method: 'DELETE' }, false);
        setWatchlistCache({ data: null, timestamp: 0 });
        return res;
    }, [request]);

    const updateWatchlist = React.useCallback(async (id, update) => {
        const res = await request(endpoints.watchlist.update(id), {
            method: 'PATCH',
            body: JSON.stringify(update),
        });
        setWatchlistCache({ data: null, timestamp: 0 });
        return res;
    }, [request]);

    // Reviews
    const createReview = React.useCallback((payload) => request(endpoints.reviews.create, { method: 'POST', body: JSON.stringify({ ...payload, movieId: String(payload.movieId) }) }), [request]);
    const getReviewsByMovie = React.useCallback((id) => request(endpoints.reviews.byMovie(String(id))), [request]);
    const updateReview = React.useCallback((id, payload) => request(endpoints.reviews.update(id), { method: 'PUT', body: JSON.stringify(payload) }), [request]);
    const deleteReview = React.useCallback((id) => request(endpoints.reviews.delete(id), { method: 'DELETE' }, false), [request]);

    // Child Profiles
    const listChildProfiles = React.useCallback(async () => {
        const p = await request(endpoints.childProfiles.list);
        setChildProfiles(p || []);
        return p;
    }, [request]);

    const createChildProfile = React.useCallback(async (p) => {
        const res = await request(endpoints.childProfiles.create, { method: 'POST', body: JSON.stringify(p) });
        await listChildProfiles();
        return res;
    }, [request, listChildProfiles]);

    const updateChildProfile = React.useCallback(async (id, p) => {
        const res = await request(endpoints.childProfiles.update(id), { method: 'PUT', body: JSON.stringify(p) });
        await listChildProfiles();
        return res;
    }, [request, listChildProfiles]);

    const deleteChildProfile = React.useCallback(async (id) => {
        const res = await request(endpoints.childProfiles.remove(id), { method: 'DELETE' }, false);
        await listChildProfiles();
        return res;
    }, [request, listChildProfiles]);

    // Admin Actions
    const adminGetStats = React.useCallback(() => request(endpoints.admin.stats), [request]);
    const adminGetUsers = React.useCallback(() => request(endpoints.admin.users), [request]);
    const adminUpdateUserRole = React.useCallback((id, role) => request(endpoints.admin.updateUserRole(id), { method: 'PATCH', body: JSON.stringify({ role }) }), [request]);
    const adminDeleteUser = React.useCallback((id) => request(endpoints.admin.deleteUser(id), { method: 'DELETE' }, false), [request]);
    const adminGetReviews = React.useCallback(() => request(endpoints.admin.reviews), [request]);
    const adminDeleteReview = React.useCallback((id) => request(endpoints.admin.deleteReview(id), { method: 'DELETE' }, false), [request]);
    const adminGetLogs = React.useCallback(() => request(endpoints.admin.logs), [request]);
    const adminGetWatchlists = React.useCallback(() => request(endpoints.admin.watchlists), [request]);

    const selectChildProfile = React.useCallback((id) => setActiveChildId(id), [setActiveChildId]);
    const clearChildProfile = React.useCallback(() => setActiveChildId(null), [setActiveChildId]);

    // Context Value Memoization
    const value = useMemo(() => ({
        token, user, activeChildId, loading, error, isAuthenticated, genres, childProfiles,
        register, login, logout, updateProfile,
        searchMovies, getTrendingMovies, getPopularMovies, getLatestMovies, getMovieDetails, getMovieTrailer, getSimilarMovies,
        getWatchlist, addToWatchlist, removeFromWatchlist, updateWatchlist,
        createReview, getReviewsByMovie, updateReview, deleteReview,
        listChildProfiles, createChildProfile, updateChildProfile, deleteChildProfile,
        selectChildProfile, clearChildProfile,
        setActiveChildId, adminGetStats, adminGetUsers, adminUpdateUserRole, adminDeleteUser,
        adminGetReviews, adminDeleteReview, adminGetLogs, adminGetWatchlists,
        getSubscription: () => request(endpoints.subscription.get),
        unsubscribe: () => request(endpoints.plans.unsubscribe, { method: 'POST' }),
        getPlans: () => request(endpoints.plans.list),
        createCheckoutSession: async (planId) => {
            const data = await request(`${BASE_URL}/create-checkout-session`, {
                method: 'POST',
                body: JSON.stringify({ userId: user?.id, planId }),
            });
            return data.sessionUrl;
        }
    }), [
        token, user, activeChildId, loading, error, isAuthenticated, genres, childProfiles,
        register, login, logout, updateProfile, searchMovies, getTrendingMovies, getPopularMovies,
        getLatestMovies, getMovieDetails, getMovieTrailer, getSimilarMovies, getWatchlist,
        addToWatchlist, removeFromWatchlist, updateWatchlist, createReview, getReviewsByMovie,
        updateReview, deleteReview, listChildProfiles, createChildProfile, updateChildProfile,
        deleteChildProfile, selectChildProfile, clearChildProfile, setActiveChildId, adminGetStats, adminGetUsers, adminUpdateUserRole,
        adminDeleteUser, adminGetReviews, adminDeleteReview, adminGetLogs, adminGetWatchlists, request
    ]);

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};


export const useStore = () => useContext(StoreContext);

export function getDashboardPath(user) {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/user';
    if (user.role === 'parent') return '/parent-dashboard';
    return '/dashboard/user';
}

export default StoreProvider;

