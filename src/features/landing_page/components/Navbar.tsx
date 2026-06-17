import Logo from '../assets/logo.png';
import { Button } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../config/paths';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/stores/authStore';
import { UserMenu } from '../../../components/ui/UserMenu';
export default function Navbar() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    navigate(PATHS.LOGIN);
  };
  return (
    <nav className="border-primary">
      <div className="w-full h-16 border-b border-primary-mid/40 flex justify-between items-center bg-card px-4 md:px-6">
        <Link
          to="/"
          className="flex items-center space-x-2 select-none cursor-pointer"
        >
          <img
            src={Logo}
            alt="DevFlow Logo"
            className="h-6 w-auto object-contain"
          />
          <span className="font-bold text-lg text-slate-800 tracking-tight">
            DevFlow
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <UserMenu username={currentUser.username} onLogout={handleLogout} />
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate(PATHS.LOGIN)}
                className="px-4 py-2 text-primary hover:scale-105"
              >
                Sign in
              </Button>

              <Button
                variant="primary"
                onClick={() => navigate(PATHS.REGISTER)}
                className="!w-auto px-6 py-1 rounded-xl hover:scale-105"
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
