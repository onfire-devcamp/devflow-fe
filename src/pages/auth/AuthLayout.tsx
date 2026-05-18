// src/pages/auth/AuthLayout.tsx
import React from 'react';
import Header from '../../components/navigation/Header';
import AuthBanner from './components/AuthBanner';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Cột Trái */}
        <AuthBanner />

        {/* Cột Phải: Nơi chứa Form (Login hoặc Register sẽ được nhúng vào đây) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white relative">
          <button
            type="button"
            className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center text-pink-400 hover:text-pink-500 font-medium cursor-pointer transition-colors text-[15px]"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
          <div className="w-full max-w-[420px] flex flex-col py-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
