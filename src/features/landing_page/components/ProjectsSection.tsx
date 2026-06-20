import { Users } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const projects = [
  {
    tag: 'FULLSTACK · ADVANCED',
    tagColor: 'text-violet-500',
    title: 'Build a Fullstack Twitter Clone',
    description:
      'Components, state, API routes, auth, and real-time feeds. Ship a social app end-to-end.',
    learners: '1.2k+',
    hours: '12h',
    avatars: ['bg-pink-400', 'bg-violet-400', 'bg-sky-400'],
  },
  {
    tag: 'FRONTEND · BEGINNER',
    tagColor: 'text-pink-500',
    title: 'Build a Modern Single-Page CV',
    description:
      'Responsive layout, print styles, animations. One page, zero frameworks, maximum craft.',
    learners: '2.4k+',
    hours: '4h',
    avatars: ['bg-pink-400', 'bg-emerald-400', 'bg-amber-400'],
  },
  {
    tag: 'BACKEND · INTERMEDIATE',
    tagColor: 'text-teal-500',
    title: 'Build a Scalable URL Shortener',
    description:
      'Hash algorithms, redirect caching, analytics dashboards. Production-grade backend.',
    learners: '1.9k+',
    hours: '8h',
    avatars: ['bg-violet-400', 'bg-pink-400', 'bg-teal-400'],
  },
];

export default function ProjectsSection() {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: cardsRef, inView: cardsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="projects" className="max-w-7xl mx-auto px-6 py-24">
      <div
        ref={headerRef}
        className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 transition-all duration-1000 transform ${
          headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 text-primary text-xs font-semibold tracking-wider uppercase">
            Project Library
          </span>
          <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-slate-900">
            Real projects. Real stacks.
          </h2>
        </div>
        <a
          href="#"
          className="text-primary font-medium text-sm hover:underline whitespace-nowrap"
        >
          Browse all 24 →
        </a>
      </div>

      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((project, index) => (
          <div
            key={project.title}
            style={{
              transitionDelay: `${index * 150}ms`,
            }}
            className={`border border-slate-200 rounded-2xl p-7 hover:shadow-lg hover:border-slate-300 transition-all duration-700 transform flex flex-col ${
              cardsInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-bold tracking-wider ${project.tagColor}`}
              >
                {project.tag}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {project.hours}
              </span>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900 leading-snug">
              {project.title}
            </h3>

            <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-1">
              {project.description}
            </p>

            <div className="mt-6 flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {project.avatars.map((bg, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full ${bg} border-2 border-white`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Users size={12} />
                <span>+ {project.learners} learners building this</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
