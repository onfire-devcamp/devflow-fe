import { useState } from 'react';
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

  const label = context === 'sign-in' ? 'Sign In' : 'Sign Up';
  const googleLogin = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      setError(null);
      setIsGoogleLoading(true);
      try {
        const data = await googleAuth(tokenResponse.access_token);
        setAuth(data.token, data.user);
        navigate('/');
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
    onError: (err: { error?: string }) => {
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
