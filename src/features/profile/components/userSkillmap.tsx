import { useEffect, useState } from 'react';
import SkillSection from './progressBar';
import { axiosClient } from '../../../lib/axiosClient';
import { useAuthStore } from '../../auth/stores/authStore';

interface SkillData {
  name: string;
  value: number;
}
const theme = {
  skillSection:
    'border border-[var(--color-primary-mid)] rounded-[24px] p-5 md:p-8 shadow-sm bg-white w-full',
};

export default function UserSkillMap() {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const token = useAuthStore((state) => state.accessToken);
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
        const response = await axiosClient.get<SkillData[], SkillData[]>(
          '/user/skills',
        );

        if (isActive) {
          setSkills(response);
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

  if (isLoading) {
    return (
      <div className="border border-[var(--color-primary-mid)] rounded-[24px] p-5 md:p-8 shadow-sm bg-white w-full animate-pulse">
        <div className="h-5 w-1/3 bg-slate-200 rounded mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-1/4 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
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
