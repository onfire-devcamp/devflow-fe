import { useEffect, useState } from 'react';
import SkillSection from './progressBar';
import { axiosClient } from '../../../lib/axiosClient';
import { useAuthStore } from '../../auth/stores/authStore';

interface SkillData {
  name: string;
  value: number;
}

export default function UserSkillMap() {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const token = useAuthStore((state) => state.token);
  const [error, setError] = useState<string | null>(null);

  // Logic Fetch API
  useEffect(() => {
    let isActive = true;

    const loadSkills = async () => {
      if (!token) {
        if (isActive) {
          setSkills([]);
          setError('Sign in to see your skill map.');
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get('/user/skills', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isActive) {
          setSkills(response.data as SkillData[]);
        }
      } catch (err) {
        console.error('Error in fetch data skills:', err);
        if (isActive) {
          setSkills([]);
          setError('Unable to load skill map right now.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadSkills();

    return () => {
      isActive = false;
    };
  }, [token]);

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

  if (error) {
    return (
      <div className="py-12 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return <SkillSection skills={skills} theme={theme} />;
}
