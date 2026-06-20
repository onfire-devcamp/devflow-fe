import Logo from '../assets/logo.png';
import { Button } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../config/paths';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/stores/authStore';
import { logoutUser } from '../../auth/api/authApi';
import { UserMenu } from '../../../components/ui/UserMenu';

const NAV_LINKS = [
  { label: 'How it works', target: 'features' },
  { label: 'Projects', target: 'projects' },
  { label: 'Testimonials', target: 'testimonials' },
  { label: 'Get started', target: 'cta' },
];

export default function Navbar() {
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
      navigate(PATHS.LOGIN);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="border-primary">
      <div className="w-full h-16 border-b border-primary-mid/40 flex justify-between items-center bg-card px-4 md:px-6">
        <div className="flex items-center gap-8">
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

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Button
                key={link.target}
                variant="ghost"
                onClick={() => scrollTo(link.target)}
                className="px-3 py-2 text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <UserMenu
              username={currentUser.username}
              avatarUrl={currentUser.avatarUrl}
              onLogout={handleLogout}
            />
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
