import React from 'react';
import logoImg from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { GuestBadge } from './GuestBadge';
import { UserMenu } from './UserMenu';

export function Header() {
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="w-full h-16 border-b border-slate-100 flex justify-between items-center bg-white px-4 md:px-6">
      <Link
        to="/"
        className="flex items-center space-x-2 select-none cursor-pointer"
      >
        <img
          src={logoImg}
          alt="DevFlow Logo"
          className="h-6 w-auto object-contain"
        />
        <span className="font-bold text-lg text-slate-800 tracking-tight">
          DevFlow
        </span>
      </Link>

      <div className="flex items-center space-x-4">
        {currentUser ? (
          <UserMenu username={currentUser.username} onLogout={handleLogout} />
        ) : (
          <GuestBadge />
        )}
      </div>
    </header>
  );
}
