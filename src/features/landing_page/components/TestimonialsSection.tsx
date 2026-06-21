interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Maya R.',
    role: 'Frontend dev · ex-bootcamp',
    quote:
      'The explain-to-pass thing felt annoying for two days. Then I realized I was actually retaining stuff. Game changer.',
  },
  {
    name: 'Devon K.',
    role: 'CS student',
    quote:
      'Built a working Stripe integration in a weekend. The mentor flagged a webhook race condition I would have shipped to prod.',
  },
  {
    name: 'Priya S.',
    role: 'Self-taught',
    quote:
      "I've quit five courses. DevFlow's the first that didn't feel like watching paint dry.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-center text-4xl lg:text-5xl font-Open Sans font-bold text-slate-900">
        "Finally, a course that{' '}
        <span className="text-primary">caught my fake confidence</span>
        <span>."</span>
      </h2>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.name}
            className="border border-primary rounded-3xl p-8"
          >
            <div className="text-yellow-400 text-lg">★★★★★</div>

            <p className="mt-6 text-slate-600 leading-relaxed min-h-[130px]">
              "{item.quote}"
            </p>

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-400 text-white flex items-center justify-center text-sm font-semibold">
                  {item.name[0]}
                </div>

                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>

                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
