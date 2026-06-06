import logoImg from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { GuestBadge } from './GuestBadge';
import { UserMenu } from './UserMenu';
import { useAuthStore } from '../../features/auth/stores/authStore';

export function Header() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full h-16 border-b border-primary-mid/40 flex justify-between items-center bg-card px-4 md:px-6">
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
