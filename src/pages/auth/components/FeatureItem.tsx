import React from 'react';
import { Shield, Sparkles, Heart } from 'lucide-react';

export type FeatureIconType = 'AI' | 'SHIELD' | 'HEART';

interface FeatureItemProps {
  icon: FeatureIconType;
  title: string;
  description: string;
}

const ICON_MAP: Record<FeatureIconType, React.ReactNode> = {
  AI: <Sparkles className="w-5 h-5 text-pink-500" strokeWidth={1.5} />,
  SHIELD: <Shield className="w-5 h-5 text-pink-500" strokeWidth={1.5} />,
  HEART: <Heart className="w-5 h-5 text-pink-500" strokeWidth={1.5} />,
};

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="bg-primary-soft w-10 h-10 rounded-full border border-pink-100 flex items-center justify-center shrink-0 shadow-xs">
        {ICON_MAP[icon]}
      </div>

      {/* text */}
      <div className="pt-0.5">
        <h3 className="font-semibold text-slate-900 text-[15px] tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureItem;
