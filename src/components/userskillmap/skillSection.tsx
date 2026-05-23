import ProgressBar from '../progressbar/ProgressBar';

interface SkillData {
  name: string;
  value: number;
}
interface SkillData {
  name: string;
  value: number;
}

interface ThemeConfig {
  skillSection: string;
  [key: string]: string;
}

interface SkillSectionProps {
  skills: SkillData[];
  theme: ThemeConfig;
}

export default function SkillSection({ skills, theme }: SkillSectionProps) {
  return (
    <section className={theme.skillSection}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Skill Map</h3>
        <p className="text-sm text-gray-400">
          Where your time has gone—and what's still ahead.
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        {skills.map((skill) => (
          <ProgressBar
            key={skill.name}
            label={skill.name}
            value={skill.value}
          />
        ))}
      </div>
    </section>
  );
}
