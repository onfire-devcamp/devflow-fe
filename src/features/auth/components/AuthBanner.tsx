import { useMemo } from 'react';
import { FeatureItem } from './FeatureItem';

const FEATURE_CONTENT = [
  {
    icon: 'AI',
    title: 'AI mentor Devi',
    description: 'Guided hints — never the full answer.',
  },
  {
    icon: 'SHIELD',
    title: 'Explain-to-pass',
    description: 'Prove understanding before unlocking.',
  },
  {
    icon: 'HEART',
    title: 'Warm by design',
    description: 'Soft feedback that keeps you building.',
  },
] as const;

export function AuthBanner() {
  const renderFeatures = useMemo(() => {
    return FEATURE_CONTENT.map((item, index) => (
      <FeatureItem
        key={index}
        icon={item.icon}
        title={item.title}
        description={item.description}
      />
    ));
  }, []);

  return (
    <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-[#fcf5f8] p-12">
      <div className="max-w-[420px] w-full">
        <h1 className="text-[44px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-1">
          Learn by building.
        </h1>
        <h1 className="text-[44px] font-bold text-primary leading-[1.1] tracking-tight mb-12">
          Guided by AI.
        </h1>
        <div className="space-y-8">{renderFeatures}</div>
      </div>
    </div>
  );
}
