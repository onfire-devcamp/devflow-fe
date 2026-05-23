import { useState, useEffect } from 'react';
import ProfileHeader from './profileHeader.tsx';
import ProfileCard from './profileCard.tsx';
import SkillSection from './skillSection.tsx';
import ActivitySection from './activitySection.tsx';

interface SkillData {
  name: string;
  value: number;
}

export default function UserProfile() {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dữ liệu Hardcode tạm thời
  const userName = 'Minh';
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

  // Logic Fetch API
  useEffect(() => {
    fetch('http://localhost:3000/api/user/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const userObj = data[0];
          if (userObj.skills) {
            const formattedSkills: SkillData[] = Object.entries(
              userObj.skills,
            ).map(([key, val]) => ({
              name: key,
              value: Number(val),
            }));
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
        <ProfileHeader userName={userName} theme={theme} />

        <div className={theme.content}>
          <ProfileCard
            userName={userName}
            streakDays={streakDays}
            completedTasks={completedTasks}
            theme={theme}
          />

          <SkillSection skills={skills} theme={theme} />

          <ActivitySection activities={activities} theme={theme} />
        </div>
      </div>
    </div>
  );
}
