import { Code2, Braces, Hourglass } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    id: '01',
    title: 'Build',
    description:
      'Pick a project, open the in-browser editor, ship the next task.',
    icon: Code2,
    iconBg: 'bg-gradient-to-br from-pink-400 to-rose-500',
  },
  {
    id: '02',
    title: 'Get reviewed',
    description:
      'AI mentor flags bugs, suggests refactors, links docs — in seconds.',
    icon: Braces,
    iconBg: 'bg-gradient-to-br from-violet-400 to-purple-500',
  },
  {
    id: '03',
    title: 'Explain to unlock',
    description:
      'Answer 1 short question in your own words. Prove understanding. Level up.',
    icon: Hourglass,
    iconBg: 'bg-gradient-to-br from-teal-400 to-emerald-500',
  },
];

export default function Features() {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: cardsRef, inView: cardsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      <div
        ref={headerRef}
        className={`text-center transition-all duration-1000 transform ${
          headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 text-primary text-xs font-semibold tracking-wider uppercase">
          How it works
        </span>

        <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-slate-900">
          A loop that makes learning <span className="text-primary">stick</span>
          <span>.</span>
        </h2>

        <p className="mt-4 text-slate-500 max-w-lg mx-auto">
          Every task is a tiny build → review → explain cycle. No passive
          tutorials. No misleading roadmaps.
        </p>
      </div>

      <div
        ref={cardsRef}
        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
              className={`border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:border-slate-300 transition-all duration-700 transform ${
                cardsInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex justify-between items-start">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center shadow-sm`}
                >
                  <Icon className="text-white" size={22} />
                </div>
                <span className="text-slate-300 text-sm font-medium">
                  {feature.id}
                </span>
              </div>
              <h3 className="mt-8 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
