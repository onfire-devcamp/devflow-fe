import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withPreventDefault } from '../../../utils/form';
import { GoogleButton } from '../../../components/ui/GoogleButton';
import { Input } from '../../../components/ui/Input';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSignIn = withPreventDefault(() => {
    // TODO: add logic here
  });

  const handleGoogleSignIn = () => {
    // TODO: add logic here
  };

  const passwordIcon = useMemo(() => {
    return showPassword ? (
      <Eye className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
    ) : (
      <EyeOff className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
    );
  }, [showPassword]);
  return (
    <div className="w-full border border-pink-200 p-8 sm:px-8 sm:py-9 rounded-[20px] bg-white shadow-sm flex flex-col justify-center">
      <h2 className="text-[28px] font-semibold mb-6 text-slate-900 tracking-tight">
        Welcome back
      </h2>

      <GoogleButton onClick={handleGoogleSignIn} />

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-pink-100"></div>
        <span className="px-4 text-[11px] text-slate-400 font-medium uppercase tracking-widest">
          Or continue with email
        </span>
        <div className="flex-1 border-t border-pink-100"></div>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-[13px] text-slate-700 mb-1.5 uppercase tracking-wide">
            Email
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-slate-400">
              <Mail
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              />
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
          <label className="block text-[13px] text-slate-700 mb-1.5 uppercase tracking-wide">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-slate-400">
              <Lock
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              />
            </span>

            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* BUTTON ICON EYE */}
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              variant="ghost"
              className="absolute right-4 top-3"
            >
              {passwordIcon}
            </Button>
          </div>
        </div>

        <Button type="submit" variant="primary" className="mt-2">
          Sign in
        </Button>
      </form>

      <p className="text-center text-[12px] text-slate-500 mt-5 leading-relaxed">
        By continuing you agree to our{' '}
        <a href="#" className="underline hover:text-slate-700">
          Terms and Privacy Policy
        </a>
        .
      </p>

      <p className="text-center text-sm text-slate-500 mt-5">
        New to DevFlow?{' '}
        <Link
          to="/register"
          className="text-pink-400 font-medium hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
