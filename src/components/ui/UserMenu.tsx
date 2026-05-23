import React, { useState, useRef, useEffect } from 'react';
import { User, Power, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface UserMenuProps {
  username: string;
  onLogout: () => void;
}

export const UserMenu = ({ username, onLogout }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="space-x-2 bg-white px-2 py-1.5 rounded-full border border-primary hover:bg-primary-soft transition-colors duration-200"
      >
        <img
          src={`https://ui-avatars.com/api/?name=${username}&background=fbcfe8&color=f472b6&bold=true`}
          alt="Avatar"
          className="w-6 h-6 rounded-full object-cover"
        />
        <span className="text-sm font-semibold text-primary px-1">
          {username}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-primary mr-1" strokeWidth={2.5} />
        ) : (
          <ChevronDown
            className="w-4 h-4 text-primary mr-1"
            strokeWidth={2.5}
          />
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-primary-mid rounded-xl shadow-sm py-2 z-50">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-2 text-sm font-medium text-primary hover:bg-primary-soft transition-colors"
          >
            <User className="w-4 h-4 mr-3" strokeWidth={2.5} />
            Profile
          </Link>
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full justify-start px-4 py-2 text-sm font-medium text-primary hover:bg-primary-soft transition-colors rounded-none"
          >
            <Power className="w-4 h-4 mr-3" strokeWidth={2.5} />
            Log out
          </Button>
        </div>
      )}
    </div>
  );
};
