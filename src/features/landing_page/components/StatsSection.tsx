const stats = [
  { value: '12,400+', label: 'Devs learning' },
  { value: '270k', label: 'Code reviews shipped' },
  { value: '94%', label: 'Finish their first project' },
  { value: '4.9/5', label: 'Mentor satisfaction' },
];

export default function StatsSection() {
  return (
    <section className="w-full bg-gradient-to-b from-pink-50/60 to-white border-t border-pink-100/50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <span className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">
                {stat.value}
              </span>
              <span className="text-sm text-slate-400 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
