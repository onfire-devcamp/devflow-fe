import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { GoogleButton } from '../../../components/ui/GoogleButton';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { login } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { validateEmail, validatePassword } from '../utils/validation';

const ERROR_DISMISS_MS = 3000;

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<LoginFormData>({ mode: 'onBlur' });

  const {
    googleLogin,
    isGoogleLoading,
    error: googleError,
  } = useGoogleAuth('sign-in');

  useEffect(() => {
    if (!formError) return;
    const id = window.setTimeout(() => setFormError(null), ERROR_DISMISS_MS);
    return () => window.clearTimeout(id);
  }, [formError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setFormError(null);
      const result = await login({
        email: data.email.trim(),
        password: data.password,
      });
      setAuth(result.token, result.user);
      navigate('/profile');
    } catch (err: unknown) {
      let message = 'Login failed. Please try again.';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setFormError(message);
    }
  };

  const displayError = formError || googleError;
  const isLoading = isSubmitting || isGoogleLoading;

  return (
    <div className="w-full border border-pink-200 p-8 sm:px-8 sm:py-9 rounded-[20px] bg-white shadow-sm flex flex-col justify-center">
      <h2 className="text-[28px] font-semibold mb-6 text-slate-900 tracking-tight">
        Welcome back
      </h2>

      <GoogleButton
        onClick={googleLogin}
        disabled={isLoading}
        label={isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
      />

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-pink-100"></div>
        <span className="px-4 text-[11px] text-fg-muted font-medium uppercase tracking-widest">
          Or continue with email
        </span>
        <div className="flex-1 border-t border-pink-100"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-[13px] text-fg mb-1.5 uppercase tracking-wide"
          >
            Email
          </label>
          <div className="relative">
            <span
              className={`absolute left-3.5 top-3 transition-colors ${errors.email ? 'text-red-400' : 'text-fg-muted'}`}
            >
              <Mail
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </span>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@devflow.app"
              disabled={isLoading}
              error={!!errors.email}
              success={!errors.email && !!touchedFields.email}
              {...register('email', {
                validate: (v) => validateEmail(v) || true,
              })}
            />
          </div>
          <div className="min-h-[18px] mt-1">
            {errors.email && (
              <p className="text-xs text-red-500 animate-fade-in" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[13px] text-fg mb-1.5 uppercase tracking-wide"
          >
            Password
          </label>
          <div className="relative">
            <span
              className={`absolute left-3.5 top-3 transition-colors ${errors.password ? 'text-red-400' : 'text-fg-muted'}`}
            >
              <Lock
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </span>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              disabled={isLoading}
              error={!!errors.password}
              success={!errors.password && !!touchedFields.password}
              {...register('password', {
                validate: (v) => validatePassword(v) || true,
              })}
            />
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              variant="ghost"
              className="absolute right-3 top-2.5 p-1.5"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <Eye className="w-5 h-5 text-fg-muted" strokeWidth={1.5} />
              ) : (
                <EyeOff className="w-5 h-5 text-fg-muted" strokeWidth={1.5} />
              )}
            </Button>
          </div>
          <div className="min-h-[18px] mt-1">
            {errors.password && (
              <p className="text-xs text-red-500 animate-fade-in" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {displayError && (
          <p className="text-sm text-red-600 animate-fade-in" role="alert">
            {displayError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-[12px] text-slate-500 mt-5 leading-relaxed">
        By continuing you agree to our{' '}
        <a href="#" className="underline hover:text-fg">
          Terms and Privacy Policy
        </a>
        .
      </p>

      <p className="text-center text-sm text-slate-500 mt-5">
        New to DevFlow?{' '}
        <Link
          to="/register"
          className="text-primary font-medium hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
