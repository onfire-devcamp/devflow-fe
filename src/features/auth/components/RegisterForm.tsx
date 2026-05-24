import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { withPreventDefault } from '../../../utils/form';
import { GoogleButton } from '../../../components/ui/GoogleButton';
import { Input } from '../../../components/ui/Input';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { register, googleAuth } from '../api/authApi';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

function getPasswordStrength(password: string): number {
  if (password.length === 0) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const STRENGTH_COLORS = [
  'bg-pink-200',
  'bg-pink-300',
  'bg-pink-400',
  'bg-primary',
];

export function RegisterForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    if (!error) return;
    const timeoutId = window.setTimeout(() => setError(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [error]);

  const handleRegister = withPreventDefault(async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }
    try {
      setError(null);
      const data = await register({ email, password, username });
      setAuth(data.token, data.user);
      navigate('/profile');
    } catch (err: unknown) {
      let errorMessage = 'Registration error';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        const data = await googleAuth(tokenResponse.access_token);
        setAuth(data.token, data.user);
        navigate('/profile');
      } catch (err: unknown) {
        let errorMessage = 'Google sign-up failed. Please try again.';
        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.message || errorMessage;
        }
        setError(errorMessage);
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => setError('Google sign-up failed. Please try again.'),
  });

  const passwordIcon = useMemo(
    () =>
      showPassword ? (
        <Eye className="w-5 h-5 text-fg-muted" strokeWidth={1.5} />
      ) : (
        <EyeOff className="w-5 h-5 text-fg-muted" strokeWidth={1.5} />
      ),
    [showPassword],
  );

  const confirmPasswordIcon = useMemo(
    () =>
      showConfirmPassword ? (
        <Eye className="w-5 h-5 text-fg-muted" strokeWidth={1.5} />
      ) : (
        <EyeOff className="w-5 h-5 text-fg-muted" strokeWidth={1.5} />
      ),
    [showConfirmPassword],
  );

  return (
    <div className="w-full border border-pink-200 p-8 sm:px-8 sm:py-9 rounded-[20px] bg-white shadow-sm flex flex-col justify-center">
      <h2 className="text-[28px] font-semibold mb-6 text-slate-900 tracking-tight">
        Create your account
      </h2>

      <GoogleButton
        onClick={() => googleLogin()}
        disabled={isGoogleLoading}
        label={isGoogleLoading ? 'Signing up...' : 'Google'}
      />

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-pink-100"></div>
        <span className="px-4 text-[11px] text-fg-muted font-medium uppercase tracking-widest">
          Or sign up with email
        </span>
        <div className="flex-1 border-t border-pink-100"></div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Full name */}
        <div>
          <label className="block text-[13px] text-fg mb-1.5 uppercase tracking-wide">
            Full name
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-fg-muted">
              <User className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" />
            </span>
            <Input
              type="text"
              placeholder="Ada Lovelace"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[13px] text-fg mb-1.5 uppercase tracking-wide">
            Email
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-fg-muted">
              <Mail className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" />
            </span>
            <Input
              type="email"
              placeholder="you@devflow.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[13px] text-fg mb-1.5 uppercase tracking-wide">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-fg-muted">
              <Lock className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" />
            </span>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              variant="ghost"
              className="absolute right-4 top-3"
            >
              {passwordIcon}
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
          <p className="text-[12px] text-fg-muted mt-1.5">Use 8+ characters</p>
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-[13px] text-fg mb-1.5 uppercase tracking-wide">
            Confirm password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-fg-muted">
              <Lock className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" />
            </span>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-type your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              variant="ghost"
              className="absolute right-4 top-3"
            >
              {confirmPasswordIcon}
            </Button>
          </div>
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-3 pt-1">
          <input
            id="terms"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-primary-mid accent-primary cursor-pointer shrink-0"
          />
          <label htmlFor="terms" className="text-[13px] text-fg-muted leading-relaxed cursor-pointer">
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

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="primary" className="mt-2">
          Create account
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
