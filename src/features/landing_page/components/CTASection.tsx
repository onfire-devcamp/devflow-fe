import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { PATHS } from '../../../config/paths';
import { useNavigate } from 'react-router-dom';
export default function CTA() {
  const navigate = useNavigate();
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="rounded-[32px] bg-gradient-to-r from-primary via-pink-400 to-purple-500 p-12 lg:p-20 text-center text-white">
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
    </section>
  );
}
