// src/pages/auth/components/AuthBanner.tsx
import React from 'react';
import FeatureItem from './FeatureItem';

const AuthBanner: React.FC = () => {
  return (
    <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-[#fcf5f8] p-12">
      <div className="max-w-[420px] w-full">
        <h1 className="text-[44px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-1">
          Learn by building.
        </h1>
        <h1 className="text-[44px] font-bold text-pink-400 leading-[1.1] tracking-tight mb-12">
          Guided by AI.
        </h1>
        <div className="space-y-8">
          <FeatureItem
            icon="AI"
            title="AI mentor Devi"
            desc="Guided hints — never the full answer."
          />
          <FeatureItem
            icon="SHIELD"
            title="Explain-to-pass"
            desc="Prove understanding before unlocking."
          />
          <FeatureItem
            icon="HEART"
            title="Warm by design"
            desc="Soft feedback that keeps you building."
          />
        </div>
      </div>
    </div>
  );
};

export default AuthBanner;
