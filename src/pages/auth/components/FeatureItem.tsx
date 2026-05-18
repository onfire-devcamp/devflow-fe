import React from 'react';

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
          <svg
            className="w-5 h-5 text-pink-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904zM18 7l-.5 2.5L15 10l2.5.5.5 2.5.5-2.5 2.5-.5-2.5-.5L18 7z"
            />
          </svg>
        );
      case 'SHIELD':
        return (
          /* Icon Khiên bảo vệ */
          <svg
            className="w-5 h-5 text-pink-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
        );
      case 'HEART':
        return (
          /* Icon Trái tim ấm áp */
          <svg
            className="w-5 h-5 text-pink-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        );
      default:
        // Dự phòng nếu truyền text thường thì hiển thị text dạng badge tròn
        return (
          <span className="text-[11px] font-bold text-pink-500 uppercase">
            {icon}
          </span>
        );
    }
  };

  return (
    <div className="flex items-start space-x-4">
      {/* Ô tròn chứa Icon màu hồng nhạt nhẹ nhàng */}
      <div className="bg-pink-50 w-10 h-10 rounded-full border border-pink-100 flex items-center justify-center shrink-0 shadow-xs">
        {renderIcon()}
      </div>

      {/* Nội dung text kế bên */}
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
