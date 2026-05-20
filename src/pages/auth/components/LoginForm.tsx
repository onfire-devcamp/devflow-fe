import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withPreventDefault } from '../../../utils/form';
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSignIn = withPreventDefault(() => {
    console.log('Logic sign in is here!');
  });

  return (
    <div className="w-full border border-pink-200 p-8 sm:px-8 sm:py-9 rounded-[20px] bg-white shadow-sm flex flex-col justify-center">
      <h2 className="text-[28px] font-semibold mb-6 text-slate-900 tracking-tight">
        Welcome back
      </h2>

      <button
        type="button"
        className="w-full border border-pink-200 rounded-xl py-3 flex items-center justify-center space-x-2 hover:bg-pink-50 transition cursor-pointer"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.12h4.01c2.34-2.16 3.69-5.32 3.69-8.74z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.01-3.12c-1.12.75-2.55 1.19-3.92 1.19-3.02 0-5.57-2.04-6.48-4.79H1.31v3.23A12 12 0 0 0 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.52 14.37A7.16 7.16 0 0 1 5.12 12c0-.82.14-1.61.4-2.37V6.4H1.31A12 12 0 0 0 0 12c0 2.11.55 4.1 1.31 5.6l4.21-3.23z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.28 2.68 1.31 6.4l4.21 3.23a7.22 7.22 0 0 1 6.48-4.88z"
          />
        </svg>
        <span className="text-sm font-medium text-slate-700 tracking-wide">
          Google
        </span>
      </button>

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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </span>

            <input
              type="email"
              placeholder="you@devflow.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-pink-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition bg-white text-slate-800 placeholder-slate-400"
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </span>

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-pink-200 rounded-xl pl-11 pr-12 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition bg-white text-slate-800 placeholder-slate-400"
              required
            />

            {/* BUTTON ICON MẮT */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-slate-400 hover:text-pink-400 cursor-pointer transition-colors focus:outline-none"
            >
              {showPassword ? (
                /* Icon Mắt Mở  */
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                /* Icon Mắt Đóng  */
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-xl py-3 mt-2 transition shadow-xs cursor-pointer text-sm"
        >
          Sign in
        </button>
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
