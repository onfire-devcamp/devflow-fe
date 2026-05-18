import React from 'react';
import logoImg from '../../assets/logo.png';

const Header: React.FC = () => {
  return (
    <header className="w-full h-16 border-b border-slate-100 flex justify-between items-center bg-white px-4 md:px-6">
      {/* NẰM SÁT MÉP TRÁI: Logo + Chữ DevFlow */}
      <div className="flex items-center space-x-2 select-none cursor-pointer">
        <img
          src={logoImg}
          alt="DevFlow Logo"
          className="h-6 w-auto object-contain"
        />
        <span className="font-bold text-lg text-slate-800 tracking-tight">
          DevFlow
        </span>
      </div>

      {/* NẰM SÁT MÉP PHẢI: Khối Guest */}
      <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
        <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="text-xs font-semibold text-slate-600">Guest</span>
      </div>
    </header>
  );
};

export default Header;
