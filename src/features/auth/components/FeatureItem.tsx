import React from 'react';
import { Shield, Sparkles, Heart } from 'lucide-react';

export type FeatureIconType = 'AI' | 'SHIELD' | 'HEART';

interface FeatureItemProps {
  icon: FeatureIconType;
  title: string;
  description: string;
}

const ICON_MAP: Record<FeatureIconType, React.ReactNode> = {
  AI: <Sparkles className="w-5 h-5 text-primary" strokeWidth={1.5} />,
  SHIELD: <Shield className="w-5 h-5 text-primary" strokeWidth={1.5} />,
  HEART: <Heart className="w-5 h-5 text-primary" strokeWidth={1.5} />,
};

export function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="bg-primary-soft w-10 h-10 rounded-full border border-primary-mid flex items-center justify-center shrink-0 shadow-xs">
        {ICON_MAP[icon]}
      </div>

      {/* text */}
      <div className="pt-0.5">
        <h3 className="font-semibold text-fg text-[15px] tracking-tight">
          {title}
        </h3>
        <p className="text-fg-muted text-sm mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
