import React from 'react';
import { Shield, Sparkles, Heart } from 'lucide-react';
interface FeatureItemProps {
  icon: 'AI' | 'SHIELD' | 'HEART' | string;
  title: string;
  desc: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, desc }) => {
  const renderIcon = () => {
    switch (icon.toUpperCase()) {
      case 'AI':
        return (
          /* Icon AI */
          <Sparkles
            className="w-5 h-5 text-pink-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          />
        );
      case 'SHIELD':
        return (
          /* Icon Shield */
          <Shield
            className="w-5 h-5 text-pink-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          />
        );
      case 'HEART':
        return (
          /* Icon heart */
          <Heart
            className="w-5 h-5 text-pink-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          />
        );
      default:
        return (
          <span className="text-[11px] font-bold text-pink-500 uppercase">
            {icon}
          </span>
        );
    }
  };

  return (
    <div className="flex items-start space-x-4">
      {/* Place for icon */}
      <div className="bg-pink-50 w-10 h-10 rounded-full border border-pink-100 flex items-center justify-center shrink-0 shadow-xs">
        {renderIcon()}
      </div>

      {/* text */}
      <div className="pt-0.5">
        <h3 className="font-semibold text-slate-900 text-[15px] tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

export default FeatureItem;
