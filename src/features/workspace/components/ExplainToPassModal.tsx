import { useState } from 'react';
import { X } from 'lucide-react';
import type { TaskDetailsState } from '../../roadmap/RoadmapType';
import { Button } from '../../../components/ui/Button';

interface ExplainToPassModalProps {
  taskDetails: TaskDetailsState | null;
  showForm: boolean;
  isEvaluating: boolean;
  onSubmit: (mcqAnswer: string, explanation: string) => void;
  onClose: () => void;
}

export function ExplainToPassModal({
  taskDetails,
  showForm,
  isEvaluating,
  onSubmit,
  onClose,
}: ExplainToPassModalProps) {
  const [mcqAnswer, setMcqAnswer] = useState('');
  const [explanation, setExplanation] = useState('');

  const [prevShowForm, setPrevShowForm] = useState(showForm);
  if (showForm !== prevShowForm) {
    setPrevShowForm(showForm);
    if (showForm) {
      setMcqAnswer('');
      setExplanation('');
    }
  }

  if (!showForm || !taskDetails) return null;

  const explainToPassMcq = taskDetails.mcq;
  const explainToPassMcqOptions = Array.isArray(explainToPassMcq?.options)
    ? explainToPassMcq.options
    : [];
  const hasExplainToPassMcq =
    Boolean(explainToPassMcq?.question) && explainToPassMcqOptions.length > 0;

  const handleSubmit = () => {
    if (!mcqAnswer || !explanation.trim() || isEvaluating) return;
    onSubmit(mcqAnswer, explanation);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4 !w-auto !p-1 text-slate-400 hover:text-slate-600 transition"
        >
          <X size={20} />
        </Button>

        <h3 className="text-lg font-bold text-slate-800 mb-4">
          Explain-to-Pass
        </h3>

        {hasExplainToPassMcq && (
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-700 mb-3">
              {explainToPassMcq?.question}
            </p>
            <div className="space-y-2">
              {explainToPassMcqOptions.map((option, index) => {
                const optionText = option.text;
                const optionValue = option.id;

                return (
                  <label
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      mcqAnswer === optionValue
                        ? 'border-primary bg-primary-soft'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mcq-answer"
                      value={optionValue}
                      checked={mcqAnswer === optionValue}
                      onChange={(e) => setMcqAnswer(e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-slate-700">{optionText}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Explain your answer in one sentence:
          </label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Briefly explain why you chose this answer..."
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!mcqAnswer || !explanation.trim() || isEvaluating}
          className="w-full px-4 !py-2.5 text-sm"
        >
          {isEvaluating ? 'Submitting...' : 'Submit Explanation'}
        </Button>
      </div>
    </div>
  );
}
