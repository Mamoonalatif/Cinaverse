import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
    } catch {}
  }, [key, storedValue]);
  return [storedValue, setStoredValue];
}

const StoreProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage('cinaverse_token', null);
  const [user, setUser] = useLocalStorage('cinaverse_user', null);
  const [activeChildId, setActiveChildId] = useLocalStorage('cinaverse_child_id', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeader = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const request = async (url, options = {}, expectJson = true) => {
    setError(null);
    const headers = {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(activeChildId ? { 'x-child-id': activeChildId } : {}),
      ...(options.headers || {}),
    };
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        errMsg = data?.message || errMsg;
      } catch {}
      throw new Error(errMsg);
    }
    if (!expectJson) return res;
    return res.json();
  };

  // Auth
  const register = async ({ email, password }) => {
    setLoading(true);
    try {
      await request(endpoints.auth.register, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      // After register, login automatically
      return await login({ email, password });
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password, remember = true }) => {
    setLoading(true);
    try {
      const data = await request(endpoints.auth.login, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const accessToken = data?.access_token;
      setToken(accessToken || null);
      // Fetch profile
      const profile = await request(endpoints.users.profile);
      setUser(profile || null);
      if (!remember) {
        // If not remembered, also mirror in sessionStorage
        try { sessionStorage.setItem('cinaverse_token', accessToken); } catch {}
      }
      return { token: accessToken, user: profile };
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await request(endpoints.auth.logout, { method: 'POST' });
    } catch {}
    setToken(null);
    setUser(null);
    setActiveChildId(null);
    try { sessionStorage.removeItem('cinaverse_token'); } catch {}
  };

  const updateProfile = async (updates) => {
    const profile = await request(endpoints.users.profile, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    setUser(profile);
    return profile;
  };

  // Movies
  const searchMovies = async (q) => {
    return request(endpoints.movies.search(q));
  };
  const getTrendingMovies = async () => request(endpoints.movies.trending);
  const getPopularMovies = async () => request(endpoints.movies.popular);
  const getLatestMovies = async () => request(endpoints.movies.latest);
  const getMovieDetails = async (id) => request(endpoints.movies.details(id));
  const getMovieTrailer = async (id) => request(endpoints.movies.trailer(id));
  const getStreamingAvailability = async (id) => request(endpoints.movies.streaming(id));

  // Watchlist
  const getWatchlist = async () => request(endpoints.watchlist.list);
  const addToWatchlist = async (movieId) => {
    return request(endpoints.watchlist.add, {
      method: 'POST',
      body: JSON.stringify({ movieId: String(movieId) }),
    });
  };
  const removeFromWatchlist = async (id) => {
    return request(endpoints.watchlist.remove(id), { method: 'DELETE' }, false);
  };

  // Reviews
  const createReview = async ({ movieId, rating, comment }) => {
    return request(endpoints.reviews.create, {
      method: 'POST',
      body: JSON.stringify({ movieId: String(movieId), rating, comment }),
    });
  };
  const getReviewsByMovie = async (movieId) => request(endpoints.reviews.byMovie(String(movieId)));
  const updateReview = async (id, { rating, comment }) => {
    return request(endpoints.reviews.update(id), {
      method: 'PUT',
      body: JSON.stringify({ rating, comment }),
    });
  };
  const deleteReview = async (id) => request(endpoints.reviews.delete(id), { method: 'DELETE' }, false);

  // Parental
  const getParentalSettings = async () => request(endpoints.parental.get);
  const setParentalSettings = async ({ minAge, bannedGenres }) => {
    return request(endpoints.parental.set, {
      method: 'POST',
      body: JSON.stringify({ minAge, bannedGenres }),
    });
  };

  // Child profiles
  const listChildProfiles = async () => request(endpoints.childProfiles.list);
  const createChildProfile = async ({ name, age, allowedGenres, maxAgeRating }) => {
    return request(endpoints.childProfiles.create, {
      method: 'POST',
      body: JSON.stringify({ name, age, allowedGenres, maxAgeRating }),
    });
  };
  const updateChildProfile = async (id, payload) => {
    return request(endpoints.childProfiles.update(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  };
  const deleteChildProfile = async (id) => request(endpoints.childProfiles.remove(id), { method: 'DELETE' }, false);
  const selectChildProfile = (id) => setActiveChildId(id);
  const clearChildProfile = () => setActiveChildId(null);

  // Plans
  const getPlans = async () => request(endpoints.plans.list);
  const purchasePlan = async ({ planId, paymentMethodId }) => {
    return request(endpoints.plans.purchase, {
      method: 'POST',
      body: JSON.stringify({ planId, paymentMethodId }),
    });
  };

  // Admin
  const adminGetUsers = async () => request(endpoints.admin.users);
  const adminUpdateUserRole = async (id, role) => {
    return request(endpoints.admin.updateUserRole(id), {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  };
  const adminDeleteUser = async (id) => request(endpoints.admin.deleteUser(id), { method: 'DELETE' }, false);
  const adminDeleteReview = async (id) => request(endpoints.admin.deleteReview(id), { method: 'DELETE' }, false);
  const adminGetLogs = async () => request(endpoints.admin.logs);
  const adminGetWatchlists = async () => request(endpoints.admin.watchlists);

  // Logs
  const getLogs = async () => request(endpoints.logs.list);

  const value = {
    BASE_URL,
    token,
    user,
    activeChildId,
    loading,
    error,
    // Auth
    register,
    login,
    logout,
    updateProfile,
    // Movies
    searchMovies,
    getTrendingMovies,
    getPopularMovies,
    getLatestMovies,
    getMovieDetails,
    getMovieTrailer,
    getStreamingAvailability,
    // Watchlist
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    // Reviews
    createReview,
    getReviewsByMovie,
    updateReview,
    deleteReview,
    // Parental
    getParentalSettings,
    setParentalSettings,
    // Child profiles
    listChildProfiles,
    createChildProfile,
    updateChildProfile,
    deleteChildProfile,
    selectChildProfile,
    clearChildProfile,
    // Active child context
    setActiveChildId,
    // Plans
    getPlans,
    purchasePlan,
    // Admin
    adminGetUsers,
    adminUpdateUserRole,
    adminDeleteUser,
    adminDeleteReview,
    adminGetLogs,
    adminGetWatchlists,
    // Logs
    getLogs,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
export default StoreProvider;
