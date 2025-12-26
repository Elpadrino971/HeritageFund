import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
    const { processSession } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const hasProcessed = useRef(false);

    useEffect(() => {
        // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
        // Prevent double processing in StrictMode
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const processAuth = async () => {
            try {
                // Extract session_id from URL fragment
                const hash = location.hash;
                const params = new URLSearchParams(hash.replace('#', ''));
                const sessionId = params.get('session_id');

                if (!sessionId) {
                    console.error('No session_id found in URL');
                    navigate('/');
                    return;
                }

                // Process the session
                const user = await processSession(sessionId);
                
                // Redirect to dashboard based on role
                if (user) {
                    const dashboardPath = `/dashboard/${user.role || 'heir'}`;
                    navigate(dashboardPath, { replace: true, state: { user } });
                } else {
                    navigate('/', { replace: true });
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                navigate('/', { replace: true });
            }
        };

        processAuth();
    }, [location.hash, navigate, processSession]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Connexion en cours...</p>
            </div>
        </div>
    );
}
