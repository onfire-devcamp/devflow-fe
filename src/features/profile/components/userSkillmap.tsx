import { useEffect, useState } from 'react';
import SkillSection from './progressBar';
import { useAuthStore } from '../../auth/stores/authStore';

interface SkillData {
  name: string;
  value: number;
}

export default function UserSkillMap() {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  // Logic Fetch API
  useEffect(() => {
    // Prevent API call if the user is not authenticated
    if (!token || !user) {
      return;
    }

    // Fetch data from the logged-in user's profile endpoint
    fetch('http://localhost:3000/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`, // Pass JWT token for authentication
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((userObj) => {
        // Transform skills object into an array format for the ProgressBar component
        console.log('DEBUG BACKEND RESPONSE:', userObj);
        if (userObj && userObj.skills) {
          const formattedSkills: SkillData[] = Object.entries(
            userObj.skills,
          ).map(([key, val]) => ({
            name: key,
            value: Number(val),
          }));
          setSkills(formattedSkills);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch user skills:', err);
        setIsLoading(false);
      });
  }, [token, user]); // Re-run effect if auth state changes

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
