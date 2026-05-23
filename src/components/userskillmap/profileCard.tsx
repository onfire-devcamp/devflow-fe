import StreakCounter from '../streakcounter/streak';

interface ThemeConfig {
  profileCard: string;
  avatar: string;
  text: string;
  [key: string]: string;
}
interface ProfileCardProps {
  userName: string;
  streakDays: number;
  completedTasks: number;
  theme: ThemeConfig;
}

export default function ProfileCard({
  userName,
  streakDays,
  completedTasks,
  theme,
}: ProfileCardProps) {
  return (
    <section className={theme.profileCard}>
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 w-full">
        <div className={theme.avatar}>MH</div>
        <div className="flex-1 flex flex-col items-center sm:items-start">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            {userName}
          </h2>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
            <StreakCounter days={streakDays} />
            <span className={theme.text}>
              <span>·</span>
              <span>{completedTasks} tasks completed</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
