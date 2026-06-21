import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const stats = [
  {
    value: 12400,
    suffix: '+',
    label: 'Devs learning',
    format: (v: number) => v.toLocaleString(),
    incrementStep: 100,
  },
  {
    value: 270,
    suffix: 'k',
    label: 'Code reviews shipped',
    format: (v: number) => v.toString(),
    incrementStep: 1,
  },
  {
    value: 94,
    suffix: '%',
    label: 'Finish their first project',
    format: (v: number) => v.toString(),
    incrementStep: 1,
  },
  {
    value: 4.7,
    suffix: '/5',
    label: 'Mentor satisfaction',
    format: (v: number) => v.toFixed(1),
  },
];

function AnimatedStat({
  stat,
  inView,
  index,
}: {
  stat: (typeof stats)[0];
  inView: boolean;
  index: number;
}) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1500;
    let timer: ReturnType<typeof setInterval>;

    if (stat.incrementStep) {
      const totalSteps = stat.value / stat.incrementStep;
      const interval = duration / totalSteps;
      let current = 0;

      timer = setInterval(() => {
        current += stat.incrementStep!;
        if (current >= stat.value) {
          setCurrentValue(stat.value);
          clearInterval(timer);
        } else {
          setCurrentValue(current);
        }
      }, interval);
    } else {
      const steps = 60;
      const interval = duration / steps;
      const increment = stat.value / steps;
      let current = 0;

      timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCurrentValue(stat.value);
          clearInterval(timer);
        } else {
          setCurrentValue(current);
        }
      }, interval);
    }

    return () => clearInterval(timer);
  }, [inView, stat.value, stat.incrementStep]);

  return (
    <div
      style={{ transitionDelay: `${index * 150}ms` }}
      className={`flex flex-col items-center gap-2 transition-all duration-1000 transform ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <span className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">
        {stat.format(currentValue)}
        {stat.suffix}
      </span>
      <span className="text-sm text-slate-400 font-medium">{stat.label}</span>
    </div>
  );
}

export default function StatsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section className="w-full bg-gradient-to-b from-pink-50/60 to-white border-t border-pink-100/50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center"
        >
          {stats.map((stat, index) => (
            <AnimatedStat
              key={stat.label}
              stat={stat}
              inView={inView}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
