import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react';
import { GoogleButton } from '../../../components/ui/GoogleButton';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { register as registerUser } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateConfirmPassword,
} from '../utils/validation';
import { TermsModal } from '../../../components/ui/TermsModal';

const ERROR_DISMISS_MS = 5000;

const STRENGTH_COLORS = [
  'bg-pink-200',
  'bg-pink-300',
  'bg-pink-400',
  'bg-primary',
];

function getPasswordStrength(password: string): number {
  if (password.length === 0) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<RegisterFormData>({ mode: 'onBlur' });

  const password = useWatch({ control, name: 'password', defaultValue: '' });
  const confirmPassword = useWatch({
    control,
    name: 'confirmPassword',
    defaultValue: '',
  });
  const passwordStrength = getPasswordStrength(password);

  const {
    googleLogin,
    isGoogleLoading,
    error: googleError,
  } = useGoogleAuth('sign-up');

  useEffect(() => {
    if (!formError) return;
    const id = window.setTimeout(() => setFormError(null), ERROR_DISMISS_MS);
    return () => window.clearTimeout(id);
  }, [formError]);

  useEffect(() => {
    if (touchedFields.confirmPassword) {
      trigger('confirmPassword');
    }
  }, [password, touchedFields.confirmPassword, trigger]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setFormError(null);
      const result = await registerUser({
        email: data.email.trim(),
        password: data.password,
        username: data.username.trim(),
      });
      setAuth(result.token, result.user);
      navigate('/profile');
    } catch (err: unknown) {
      let message = 'Something went wrong. Please try again.';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      setFormError(message);
    }
  };

  const displayError = formError || googleError;
  const isLoading = isSubmitting || isGoogleLoading;

  return (
    <div className="w-full border border-pink-200 p-8 sm:px-8 sm:py-9 rounded-[20px] bg-white shadow-sm flex flex-col justify-center">
      <h2 className="text-[28px] font-semibold mb-6 text-slate-900 tracking-tight">
        Create your account
      </h2>

      <GoogleButton
        onClick={googleLogin}
        disabled={isLoading}
        label={isGoogleLoading ? 'Signing up...' : 'Continue with Google'}
      />

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-pink-100" />
        <span className="px-4 text-[11px] text-fg-muted font-medium uppercase tracking-widest">
          Or sign up with email
        </span>
        <div className="flex-1 border-t border-pink-100" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full name */}
        <div>
          <label
            htmlFor="username"
            className="block text-[13px] text-fg mb-1.5 uppercase tracking-wide"
          >
            Username
          </label>
          <div className="relative">
            <span
              className={`absolute left-3.5 top-3 transition-colors ${errors.username ? 'text-red-400' : 'text-fg-muted'}`}
            >
              <User
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </span>
            <Input
              id="username"
              type="text"
              autoComplete="name"
              placeholder="Ada Lovelace"
              disabled={isLoading}
              error={!!errors.username}
              success={!errors.username && !!touchedFields.username}
              {...register('username', {
                validate: (v) => validateUsername(v) || true,
              })}
            />
          </div>
          <div className="min-h-[18px] mt-1">
            {errors.username && (
              <p className="text-xs text-red-500 animate-fade-in" role="alert">
                {errors.username.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
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
              autoComplete="new-password"
              placeholder="At least 8 characters"
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

          <div className="flex gap-1 mt-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                  i < passwordStrength
                    ? STRENGTH_COLORS[passwordStrength - 1]
                    : 'bg-pink-100'
                }`}
              />
            ))}
          </div>

          <div className="min-h-[18px] mt-1">
            {errors.password ? (
              <p className="text-xs text-red-500 animate-fade-in" role="alert">
                {errors.password.message}
              </p>
            ) : password.length >= 8 ? (
              <p className="text-[12px] text-emerald-500 flex items-center gap-1 animate-fade-in">
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                Looks good!
              </p>
            ) : (
              <p className="text-[12px] text-fg-muted">Use 8+ characters</p>
            )}
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-[13px] text-fg mb-1.5 uppercase tracking-wide"
          >
            Confirm password
          </label>
          <div className="relative">
            <span
              className={`absolute left-3.5 top-3 transition-colors ${errors.confirmPassword ? 'text-red-400' : 'text-fg-muted'}`}
            >
              <Lock
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </span>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-type your password"
              disabled={isLoading}
              error={!!errors.confirmPassword}
              success={
                !errors.confirmPassword && !!touchedFields.confirmPassword
              }
              {...register('confirmPassword', {
                validate: (v) => validateConfirmPassword(password, v) || true,
              })}
            />
            <Button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              variant="ghost"
              className="absolute right-3 top-2.5 p-1.5"
              aria-label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
            >
              {showConfirmPassword ? (
                <Eye className="w-5 h-5 text-fg-muted" strokeWidth={1.5} />
              ) : (
                <EyeOff className="w-5 h-5 text-fg-muted" strokeWidth={1.5} />
              )}
            </Button>
          </div>
          <div className="min-h-[18px] mt-1">
            {errors.confirmPassword ? (
              <p className="text-xs text-red-500 animate-fade-in" role="alert">
                {errors.confirmPassword.message}
              </p>
            ) : confirmPassword && confirmPassword === password ? (
              <p className="text-[12px] text-emerald-500 flex items-center gap-1 animate-fade-in">
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                Passwords match
              </p>
            ) : null}
          </div>
        </div>

        {/* Terms */}
        <div className="space-y-1 pt-1">
          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              disabled={isLoading}
              className="mt-0.5 w-4 h-4 rounded border-primary-mid accent-primary cursor-pointer shrink-0"
              {...register('terms', {
                validate: (v) =>
                  v ||
                  'Please agree to the Terms of Service and Privacy Policy.',
              })}
            />
            <label
              htmlFor="terms"
              className="text-[13px] text-fg-muted leading-relaxed cursor-pointer"
            >
              I agree to the{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsTermsOpen(true);
                }}
                className="text-primary hover:underline cursor-pointer"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsTermsOpen(true);
                }}
                className="text-primary hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              .
            </label>
          </div>
          <div className="min-h-[18px]">
            {errors.terms && (
              <p className="text-xs text-red-500 animate-fade-in" role="alert">
                {errors.terms.message}
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
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
}
