import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-default"
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800">
            Terms of Service & Privacy Policy
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="!p-2 !text-slate-400 hover:!bg-slate-100 hover:!text-slate-600 !rounded-lg !transition-colors !cursor-pointer"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 text-slate-600 leading-relaxed text-sm">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              1. Introduction
            </h3>
            <p>
              Welcome to DevFlow. By using our platform, you agree to these
              Terms of Service. Our mission is to help developers learn by
              building real projects. Please read these terms carefully.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              2. User Accounts
            </h3>
            <p>
              You must provide accurate information when creating an account.
              You are responsible for safeguarding your password and for all
              activities that occur under your account.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              3. Acceptable Use
            </h3>
            <p>
              You agree not to misuse our services. You may not use DevFlow for
              any illegal purpose or to violate any laws in your jurisdiction.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              4. Privacy Policy
            </h3>
            <p>
              We care about your privacy. We collect minimal personal data to
              provide and improve our services. We do not sell your personal
              information to third parties.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              5. Code and Projects
            </h3>
            <p>
              The code you write remains yours. However, by using DevFlow, you
              grant us a license to host, display, and analyze your code to
              provide AI reviews and project scoring.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              6. Changes to Terms
            </h3>
            <p>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes via email or an announcement
              on the platform.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <Button onClick={onClose} className="!w-auto px-6 py-2">
            I Understand
          </Button>
        </div>
      </div>
    </div>
  );
}
