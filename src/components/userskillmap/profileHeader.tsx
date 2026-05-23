import logo from '../../assets/logo.png';

interface ThemeConfig {
  header: string;
  Logo: string;
  brandLogo: string;
  badge: string;
  [key: string]: string;
}
interface ProfileHeaderProps {
  userName: string;
  theme: ThemeConfig;
}

export default function ProfileHeader({ userName, theme }: ProfileHeaderProps) {
  return (
    <header className={theme.header}>
      <div className={theme.Logo}>
        <img src={logo} alt="DevFlow Logo" className="w-8 h-8" />
        <h1 className={theme.brandLogo}>DevFlow</h1>
      </div>

      <span
        className={`${theme.badge} inline-flex items-center gap-2 justify-center`}
      >
        {userName}
        <svg
          className="w-3 h-3 stroke-[3px] text-[var(--color-primary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 15.75l7.5-7.5 7.5 7.5"
          />
        </svg>
      </span>
    </header>
  );
}
