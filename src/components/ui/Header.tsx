import logoImg from '../../assets/logo.png';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, User } from 'lucide-react';
import { GuestBadge } from './GuestBadge';
import { UserMenu } from './UserMenu';
import { useAuthStore } from '../../features/auth/stores/authStore';
import { logoutUser } from '../../features/auth/api/authApi';

export function Header() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Failed to logout from server:', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="w-full h-16 border-b border-primary-mid/40 flex justify-between items-center bg-card px-4 md:px-6 relative z-[100]">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="flex items-center space-x-2 select-none cursor-pointer"
        >
          <img
            src={logoImg}
            alt="DevFlow Logo"
            className="h-6 w-auto object-contain"
          />
          <span className="font-bold text-lg text-slate-800 tracking-tight pr-4 md:border-r border-gray-200">
            DevFlow
          </span>
        </Link>

        {currentUser && (
          <nav className="hidden md:flex items-center gap-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  isActive
                    ? 'bg-pink-50 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`
              }
            >
              <Compass size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  isActive
                    ? 'bg-pink-50 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`
              }
            >
              <User size={18} />
              <span>Profile</span>
            </NavLink>
          </nav>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {currentUser ? (
          <UserMenu
            username={currentUser.username}
            avatarUrl={currentUser.avatarUrl}
            onLogout={handleLogout}
          />
        ) : (
          <GuestBadge />
        )}
      </div>
    </header>
  );
}
