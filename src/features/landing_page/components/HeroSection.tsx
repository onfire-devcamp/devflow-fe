import { useEffect, useState, useCallback } from 'react';
import { Button } from '../../../components/ui/Button';
import { ArrowRight, Play } from 'lucide-react';
import { PATHS } from '../../../config/paths';
import { useNavigate } from 'react-router-dom';

const CODE_LINES = [
  {
    indent: 0,
    tokens: [
      { type: 'keyword', text: 'import' },
      { type: 'plain', text: ' { useState } ' },
      { type: 'keyword', text: 'from' },
      { type: 'string', text: " 'react'" },
      { type: 'plain', text: ';' },
    ],
  },
  {
    indent: 0,
    tokens: [
      { type: 'keyword', text: 'import' },
      { type: 'plain', text: ' { Button } ' },
      { type: 'keyword', text: 'from' },
      { type: 'string', text: " './ui'" },
      { type: 'plain', text: ';' },
    ],
  },
  { indent: 0, tokens: [] },
  {
    indent: 0,
    tokens: [
      { type: 'keyword', text: 'export default function' },
      { type: 'function', text: ' App' },
      { type: 'plain', text: '() {' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { type: 'keyword', text: 'const' },
      { type: 'plain', text: ' [count, setCount] = ' },
      { type: 'function', text: 'useState' },
      { type: 'plain', text: '(' },
      { type: 'number', text: '0' },
      { type: 'plain', text: ');' },
    ],
  },
  { indent: 0, tokens: [] },
  {
    indent: 1,
    tokens: [
      { type: 'keyword', text: 'return' },
      { type: 'plain', text: ' (' },
    ],
  },
  {
    indent: 2,
    tokens: [
      { type: 'tag', text: '<div' },
      { type: 'attr', text: ' className' },
      { type: 'plain', text: '=' },
      { type: 'string', text: '"p-6"' },
      { type: 'tag', text: '>' },
    ],
  },
  {
    indent: 3,
    tokens: [
      { type: 'tag', text: '<h1>' },
      { type: 'plain', text: 'Count: {count}' },
      { type: 'tag', text: '</h1>' },
    ],
  },
  { indent: 3, tokens: [{ type: 'tag', text: '<Button' }] },
  {
    indent: 4,
    tokens: [
      { type: 'attr', text: 'onClick' },
      { type: 'plain', text: '={() => ' },
      { type: 'function', text: 'setCount' },
      { type: 'plain', text: '(c => c + 1)}' },
    ],
  },
  { indent: 3, tokens: [{ type: 'tag', text: '>' }] },
  { indent: 4, tokens: [{ type: 'plain', text: 'Increment' }] },
  { indent: 3, tokens: [{ type: 'tag', text: '</Button>' }] },
  { indent: 2, tokens: [{ type: 'tag', text: '</div>' }] },
  { indent: 1, tokens: [{ type: 'plain', text: ');' }] },
  { indent: 0, tokens: [{ type: 'plain', text: '}' }] },
];

const TOKEN_COLORS: Record<string, string> = {
  keyword: 'text-purple-400',
  string: 'text-amber-300',
  function: 'text-blue-300',
  number: 'text-orange-300',
  tag: 'text-pink-400',
  attr: 'text-sky-300',
  plain: 'text-slate-300',
};

function AnimatedCodeEditor() {
  const [visibleLines, setVisibleLines] = useState(0);

  const animate = useCallback(() => {
    setVisibleLines(0);
    let line = 0;
    const interval = setInterval(() => {
      line++;
      if (line > CODE_LINES.length) {
        clearInterval(interval);
        setTimeout(() => animate(), 2500);
        return;
      }
      setVisibleLines(line);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = animate();
    return cleanup;
  }, [animate]);

  return (
    <div className="w-full rounded-2xl bg-[#1e1e2e] shadow-2xl overflow-hidden border border-white/5">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#181825] border-b border-white/5">
        <div className="w-3 h-3 rounded-full bg-red-400/80" />
        <div className="w-3 h-3 rounded-full bg-amber-400/80" />
        <div className="w-3 h-3 rounded-full bg-green-400/80" />
        <span className="ml-3 text-xs text-slate-500 font-mono">App.tsx</span>
      </div>

      <div className="p-5 font-mono text-[13px] leading-6 min-h-[340px]">
        {CODE_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex animate-fade-in">
            <span className="w-7 shrink-0 text-right mr-4 text-slate-600 select-none text-xs">
              {i + 1}
            </span>
            <span style={{ paddingLeft: `${line.indent * 20}px` }}>
              {line.tokens.map((token, j) => (
                <span key={j} className={TOKEN_COLORS[token.type]}>
                  {token.text}
                </span>
              ))}
            </span>
          </div>
        ))}
        {visibleLines < CODE_LINES.length && (
          <div className="flex">
            <span className="w-7 shrink-0 mr-4" />
            <span className="inline-block w-2 h-5 bg-slate-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 min-h-[80vh] flex items-center py-16">
      <div className="flex flex-col lg:flex-row items-center gap-16 w-full">
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
            Stop watching tutorials.
            <br />
            <span className="text-primary">Build real apps</span>
            <br />
            with an AI mentor.
          </h1>

          <p className="mt-6 text-lg text-slate-500 leading-relaxed">
            Guided projects, instant code reviews, and an{' '}
            <strong className="text-slate-700">explain-to-pass</strong> gate
            that proves you actually understand what you wrote.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              onClick={() => navigate(PATHS.DASHBOARD)}
              className="!w-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:scale-105 text-base"
            >
              Start your first project
              <ArrowRight size={18} />
            </Button>

            <Button
              variant="ghost"
              onClick={scrollToFeatures}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Play size={16} className="text-slate-400" />
              See how it works
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg lg:max-w-none">
          <AnimatedCodeEditor />
        </div>
      </div>
    </section>
  );
}
