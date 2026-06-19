import { Code2, Braces, Hourglass } from 'lucide-react';

const features = [
  {
    id: '01',
    title: 'Build',
    description:
      'Pick a project, open the in-browser editor, ship the next task.',
    icon: Code2,
  },

  {
    id: '02',
    title: 'Get reviewed',
    description:
      ' AI mentor flags bugs, suggests refactors, links docs in seconds.',
    icon: Braces,
  },

  {
    id: '03',
    title: 'Explain to unlock',
    description:
      'Answer one short question in your own words. Prove understanding. Level up.',
    icon: Hourglass,
  },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-center text-4xl lg:text-5xl font-bold text-slate-900">
        A loop that makes learning <span className="text-primary">stick</span>
        <span>.</span>
      </h2>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className="border border-primary rounded-3xl p-8 "
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                  <Icon className="text-white" size={22} />
                </div>
                <span className="text-slate-300 text-sm">{feature.id}</span>
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
