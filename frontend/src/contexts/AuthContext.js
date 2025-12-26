import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuth = useCallback(async () => {
        try {
            const response = await axios.get(`${API}/auth/me`, {
                withCredentials: true
            });
            setUser(response.data);
            setError(null);
        } catch (err) {
            setUser(null);
            if (err.response?.status !== 401) {
                console.error('Auth check error:', err);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = () => {
        // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
        const redirectUrl = window.location.origin + '/auth/callback';
        window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
    };

    const logout = async () => {
        try {
            await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
        }
    };

    const updateRole = async (role) => {
        try {
            await axios.post(`${API}/auth/role?role=${role}`, {}, { withCredentials: true });
            setUser(prev => prev ? { ...prev, role } : null);
        } catch (err) {
            console.error('Role update error:', err);
            throw err;
        }
    };

    const processSession = async (sessionId) => {
        try {
            const response = await axios.get(`${API}/auth/session?session_id=${sessionId}`, {
                withCredentials: true
            });
            setUser(response.data);
            return response.data;
        } catch (err) {
            console.error('Session processing error:', err);
            throw err;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        updateRole,
        processSession,
        checkAuth,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
