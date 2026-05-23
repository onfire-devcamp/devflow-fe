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
        {skills.map((skill) => {
          const percentage = Math.min(Math.max(skill.value, 0), 100);

          return (
            <div key={skill.name} className="w-full mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {skill.name}
                </span>
                <span className="text-sm text-gray-400">{skill.value}%</span>
              </div>

              <div className="w-full h-2.5 bg-[var(--color-primary-soft)] rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: 'var(--color-purple)',
                    borderRadius: '999px',
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
