import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleButton } from '../../../components/ui/GoogleButton';
import { Input } from '../../../components/ui/Input';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useLoginForm } from '../hooks/useLoginForm';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    email,
    setEmail,
    password,
    setPassword,
    touched,
    fieldErrors,
    formError,
    isSubmitting,
    handleBlur,
    handleSubmit,
    inputState,
  } = useLoginForm();
  const {
    googleLogin,
    isGoogleLoading,
    error: googleError,
  } = useGoogleAuth('sign-in');

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
        label={isGoogleLoading ? 'Signing in...' : 'Google'}
      />

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-pink-100"></div>
        <span className="px-4 text-[11px] text-fg-muted font-medium uppercase tracking-widest">
          Or continue with email
        </span>
        <div className="flex-1 border-t border-pink-100"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-[13px] text-fg mb-1.5 uppercase tracking-wide"
          >
            Email
          </label>
          <div className="relative">
            <span
              className={`absolute left-3.5 top-3 transition-colors ${touched.email && fieldErrors.email ? 'text-red-400' : 'text-fg-muted'}`}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email', email)}
              disabled={isLoading}
              {...inputState('email', email)}
            />
          </div>
          <div className="min-h-[18px] mt-1">
            {touched.email && fieldErrors.email && (
              <p className="text-xs text-red-500 animate-fade-in" role="alert">
                {fieldErrors.email}
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
              className={`absolute left-3.5 top-3 transition-colors ${touched.password && fieldErrors.password ? 'text-red-400' : 'text-fg-muted'}`}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password', password)}
              disabled={isLoading}
              {...inputState('password', password)}
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
            {touched.password && fieldErrors.password && (
              <p className="text-xs text-red-500 animate-fade-in" role="alert">
                {fieldErrors.password}
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
