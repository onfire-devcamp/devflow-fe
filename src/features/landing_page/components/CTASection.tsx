import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { PATHS } from '../../../config/paths';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

export default function CTA() {
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="cta" className="max-w-6xl mx-auto px-6 py-16">
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-[32px] bg-gradient-to-r from-primary via-pink-400 to-purple-500 p-12 lg:p-20 text-center text-white transition-all duration-1000 transform ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10">
          <Zap className="mx-auto mb-8" size={32} />

          <h2 className="text-4xl lg:text-6xl font-bold">
            Your next project is
            <br />
            one click away.
          </h2>

          <p className="mt-6 text-white/80 max-w-xl mx-auto">
            Join 12,400+ developers who stopped tutorial-hopping and started
            shipping.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(PATHS.DASHBOARD)}
              className="bg-white text-primary px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              Start building free
              <ArrowRight size={18} />
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate(PATHS.LOGIN)}
              className="border border-white/40 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-colors"
            >
              I already have an account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
