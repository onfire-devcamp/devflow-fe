import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ProjectCompletionModalProps {
  projectSlug: string;
}

export function ProjectCompletionModal({
  projectSlug,
}: ProjectCompletionModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl flex flex-col items-center text-center transform transition-all animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>

        <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">
          Project Complete!
        </h2>

        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Incredible work! You've built the entire application from scratch.
        </p>

        <Button
          onClick={() => navigate(`/workspace/${projectSlug}/summary`)}
          className="!w-full !bg-indigo-600 hover:!bg-indigo-700 !text-white !font-bold !text-lg !py-4 !px-6 !rounded-xl !shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-[0.98] !cursor-pointer"
        >
          View My Scorecard
        </Button>
      </div>
    </div>
  );
}
