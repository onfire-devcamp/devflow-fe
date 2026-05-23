import { useEffect, useState } from 'react';
import SkillSection from './progressBar';

interface SkillData {
  name: string;
  value: number;
}

export default function UserSkillMap() {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    skillSection:
      'border border-[var(--color-primary-mid)] rounded-[24px] p-5 md:p-8 shadow-sm bg-white w-full',
  };

  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center text-gray-500">
        Loading Skill Map...
      </div>
    );
  }

  return <SkillSection skills={skills} theme={theme} />;
}
