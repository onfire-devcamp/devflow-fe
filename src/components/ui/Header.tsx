import React from 'react';
import logoImg from '../../assets/logo.png';
import { User } from 'lucide-react';
const Header: React.FC = () => {
  return (
    <header className="w-full h-16 border-b border-slate-100 flex justify-between items-center bg-white px-4 md:px-6">
      {/* LOCATED NEAR THE LEFT EDGE: Logo + DevFlow Text*/}
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

      {/* LOCATED NEAR THE RIGHT EDGE: Guest Block */}
      <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
        <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
          <User
            className="w-3 h-3 text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          />
        </div>
        <span className="text-xs font-semibold text-slate-600">Guest</span>
      </div>
    </header>
  );
};

export default Header;
