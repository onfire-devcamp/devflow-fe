// src/pages/auth/AuthLayout.tsx
import React from 'react';
import Header from '../../components/ui/Header';
import AuthBanner from './components/AuthBanner';
import { ArrowLeft } from 'lucide-react';
import { PageContainer } from '../../components/ui/PageContainer';
import { Button } from '../../components/ui/Button';
interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <PageContainer>
      <Header />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Column */}
        <AuthBanner />

        {/* Right Column: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white relative">
          <Button
            type="button"
            variant="ghost"
            className="absolute top-8 left-8 md:top-12 md:left-12 text-[15px] text-pink-400 hover:text-pink-500"
          >
            <ArrowLeft
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            />
            Back
          </Button>
          <div className="w-full max-w-[420px] flex flex-col py-10">
            {children}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AuthLayout;
