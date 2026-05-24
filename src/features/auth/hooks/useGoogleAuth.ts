import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleAuth } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';

export function useGoogleAuth(context: 'sign-in' | 'sign-up' = 'sign-in') {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;
    const id = window.setTimeout(() => setError(null), 5000);
    return () => window.clearTimeout(id);
  }, [error]);

  const label = context === 'sign-up' ? 'sign-up' : 'sign-in';

  const googleLogin = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        const data = await googleAuth(tokenResponse.access_token);
        setAuth(data.token, data.user);
        navigate('/profile');
      } catch (err: unknown) {
        let message = `Google ${label} failed. Please try again.`;
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.message || message;
        }
        setError(message);
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (err) => {
      if (
        err?.error === 'popup_closed_by_user' ||
        err?.error === 'access_denied'
      )
        return;
      setError(
        `Google ${label} failed. Make sure popups are allowed and try again.`,
      );
    },
  });

  return { googleLogin: () => googleLogin(), isGoogleLoading, error, setError };
}
