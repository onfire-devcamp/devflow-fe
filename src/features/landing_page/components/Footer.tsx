import Logo from '../assets/logo.png';
import { Globe } from 'lucide-react';

import { GithubIcon } from '../../../components/icons/GithubIcon';

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="DevFlow" className="h-5 w-auto" />
            <span className="text-sm text-slate-400">
              DevFlow © 2026 — Build to learn.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/onfire-devcamp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors"
            >
              <GithubIcon size={16} />
              GitHub
            </a>
            <a
              href="https://fessior.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors"
            >
              <Globe size={16} />
              Community
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
