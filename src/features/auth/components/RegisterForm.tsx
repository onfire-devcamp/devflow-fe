import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleButton } from '../../../components/ui/GoogleButton';
import { Input } from '../../../components/ui/Input';
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

const STRENGTH_COLORS = [
  'bg-pink-200',
  'bg-pink-300',
  'bg-pink-400',
  'bg-primary',
];

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    agreed,
    setAgreed,
    isSubmitting,
    fieldErrors,
    setFieldErrors,
    touched,
    formError,
    passwordStrength,
    handleBlur,
    handleSubmit,
    inputState,
    iconColor,
  } = useRegisterForm();

  const {
    googleLogin,
    isGoogleLoading,
    error: googleError,
  } = useGoogleAuth('sign-up');

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
        label={isGoogleLoading ? 'Signing up...' : 'Google'}
      />

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-pink-100" />
        <span className="px-4 text-[11px] text-fg-muted font-medium uppercase tracking-widest">
          Or sign up with email
        </span>
        <div className="flex-1 border-t border-pink-100" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full name */}
        <div>
          <label
            htmlFor="username"
            className="block text-[13px] text-fg mb-1.5 uppercase tracking-wide"
          >
            Full name
          </label>
          <div className="relative">
            <span
              className={`absolute left-3.5 top-3 transition-colors ${iconColor('username')}`}
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => handleBlur('username', username)}
              disabled={isLoading}
              {...inputState('username', username)}
            />
          </div>
          <div className="min-h-[18px] mt-1">
            {touched.username && fieldErrors.username && (
              <p className="text-xs text-red-500 animate-fade-in" role="alert">
                {fieldErrors.username}
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
              className={`absolute left-3.5 top-3 transition-colors ${iconColor('email')}`}
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
              className={`absolute left-3.5 top-3 transition-colors ${iconColor('password')}`}
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

          {/* Strength bar */}
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
            {touched.password && fieldErrors.password ? (
              <p className="text-xs text-red-500 animate-fade-in" role="alert">
                {fieldErrors.password}
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
              className={`absolute left-3.5 top-3 transition-colors ${iconColor('confirmPassword')}`}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur('confirmPassword', confirmPassword)}
              disabled={isLoading}
              {...inputState('confirmPassword', confirmPassword)}
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
            {touched.confirmPassword && fieldErrors.confirmPassword ? (
              <p className="text-xs text-red-500 animate-fade-in" role="alert">
                {fieldErrors.confirmPassword}
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
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked)
                  setFieldErrors((prev) => ({ ...prev, terms: '' }));
              }}
              disabled={isLoading}
              className="mt-0.5 w-4 h-4 rounded border-primary-mid accent-primary cursor-pointer shrink-0"
            />
            <label
              htmlFor="terms"
              className="text-[13px] text-fg-muted leading-relaxed cursor-pointer"
            >
              I agree to the{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
          <div className="min-h-[18px]">
            {fieldErrors.terms && (
              <p className="text-xs text-red-500 animate-fade-in" role="alert">
                {fieldErrors.terms}
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
    </div>
  );
}
