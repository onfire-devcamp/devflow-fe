import { useState, useEffect } from 'react';
import ProgressBar from '../progressbar/ProgressBar';
import ActivityItem from '../activities/activitiesItem';
import logo from '../../assets/logo.png';
import StreakCounter from '../streakcounter/streak';

interface SkillData {
  name: string;
  value: number;
}

export default function UserProfile() {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hardcode for user info and activities (simulate)
  const userName = 'Thân Đức Minh Duy';
  const streakDays = 5;
  const completedTasks = 2;

  const [activities] = useState([
    {
      id: 1,
      category: 'SETUP & FOUNDATIONS',
      task: 'Initialize the Vite project',
      status: 'completed',
    },
    {
      id: 2,
      category: 'SETUP & FOUNDATIONS',
      task: 'Add Tailwind CSS',
      status: 'completed',
    },
  ]);

  // 2. Fetch data for progress skills
  useEffect(() => {
    fetch('http://localhost:3000/api/user/')
      .then((res) => res.json())
      .then((data) => {
        // Check if data exists and has at least one user object
        if (data && data.length > 0) {
          const userObj = data[0]; // Stimulate the first one

          if (userObj.skills) {
            // Main logic: Convert Object { frontend: 40, backend: 25 } to array [{ name: 'frontend', value: 40 }]
            const formattedSkills: SkillData[] = Object.entries(
              userObj.skills,
            ).map(([key, val]) => ({
              name: key,
              value: Number(val),
            }));

            // update state with formatted skills
            setSkills(formattedSkills);
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error in fetch data skills:', err);
        setIsLoading(false);
      });
  }, []);

  const theme = {
    root: 'min-h-screen bg-white flex flex-col w-full',
    mainCard: 'w-full min-h-screen flex flex-col',
    header:
      'w-full px-6 md:px-12 lg:px-20 py-4 md:py-5 border-b border-gray-100 flex justify-between items-center bg-[#faf7fb]/50',
    brandLogo:
      "font-['Open Sans'] font-semibold text-[15px] text-[var(--color-fg)]",
    text: 'text-xs md:text-sm font-[var(--font-sans)] text-gray-400 flex items-center gap-1 md:gap-2 whitespace-nowrap',
    Logo: 'flex items-center gap-2 w-103 h-32',
    badge:
      'flex items-center text-[11px] bg-white px-4 py-1.5 rounded-full border border-purple-100 text-[var(--color-primary)] font-bold uppercase tracking-wider shadow-sm',
    content:
      'w-full px-6 md:px-12 lg:px-20 py-6 md:py-10 space-y-6 md:space-y-8 flex-1 class-content',
    profileCard:
      'flex flex-col sm:flex-row items-center gap-4 sm:gap-5 p-5 md:p-6 rounded-[24px] bg-gradient-to-b from-[var(--color-primary-soft)] to-white border border-[var(--color-primary-mid)] shadow-sm w-full text-center sm:text-left',
    avatar:
      'w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md shrink-0 uppercase',
    skillSection:
      'border border-[var(--color-primary-mid)] rounded-[24px] p-5 md:p-8 shadow-sm bg-white w-full',
    activitySection:
      'border border-gray-100 rounded-[24px] p-5 md:p-8 shadow-sm bg-white w-full',
    activityHeader: 'flex justify-between items-center mb-6 md:mb-8',
    openProjectBtn:
      'text-xs font-semibold px-3 py-1.5 md:px-4 md:py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading Skill Map...
      </div>
    );
  }

  return (
    <div className={theme.root}>
      <div className={theme.mainCard}>
        <header className={theme.header}>
          <div className={theme.Logo}>
            <img src={logo} alt="DevFlow Logo" className="w-8 h-8" />
            <h1 className={theme.brandLogo}>DevFlow</h1>
          </div>
          <span className={theme.badge}>{userName}</span>
        </header>

        <div className={theme.content}>
          {/* User Info Section (Hardcoded) */}
          <section className={theme.profileCard}>
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 w-full">
              <div className={theme.avatar}>DUY</div>
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

          {/* Skill Visualization Section (Dynamic render) */}
          <section className={theme.skillSection}>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Skill Map</h3>
              <p className="text-sm text-gray-400">
                Where your time has gone—and what's still ahead.
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              {/* Render ProgressBar */}
              {skills.map((skill) => (
                <ProgressBar
                  key={skill.name}
                  label={skill.name}
                  value={skill.value}
                />
              ))}
            </div>
          </section>

          {/* Activity Timeline */}
          <section className={theme.activitySection}>
            <div className={theme.activityHeader}>
              <h3 className="text-xl font-bold text-gray-800">
                Recent activity
              </h3>
              <button className={theme.openProjectBtn}>Open project</button>
            </div>

            <div className="flex flex-col gap-2">
              {activities.map((item, index) => (
                <ActivityItem
                  key={item.id}
                  category={item.category}
                  task={item.task}
                  isLast={index === activities.length - 1}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
