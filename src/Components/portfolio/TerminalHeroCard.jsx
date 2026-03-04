import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function TerminalHeroCard({
  photoUrl,
  name,
  terminalTitle = 'portfolio.py',
  codeLineTemplate = 'print("Hello World! My name is {{name}}.")',
  typingSpeedMs = 50,
  isActive = true
}) {
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typingIndexRef = useRef(0);

  const fullLine = useMemo(() => {
    const safeName = name || '';
    return String(codeLineTemplate || '')
      .replaceAll('{{name}}', safeName)
      .replaceAll('{name}', safeName);
  }, [codeLineTemplate, name]);

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  useEffect(() => {
    typingIndexRef.current = 0;
    setTypedText('');
    setIsTypingComplete(false);
  }, [fullLine]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedText(fullLine);
      setIsTypingComplete(true);
      typingIndexRef.current = fullLine.length + 1;
      return;
    }

    if (!isActive || isTypingComplete) return;

    const interval = setInterval(() => {
      if (typingIndexRef.current <= fullLine.length) {
        setTypedText(fullLine.slice(0, typingIndexRef.current));
        typingIndexRef.current += 1;
        return;
      }

      setIsTypingComplete(true);
      clearInterval(interval);
    }, typingSpeedMs);

    return () => clearInterval(interval);
  }, [fullLine, isActive, isTypingComplete, prefersReducedMotion, typingSpeedMs]);

  const renderHighlightedCode = (text) => {
    if (!text) return null;

    const parts = [];
    let remaining = text;

    if (remaining.startsWith('print')) {
      parts.push(
        <span key="print" className="text-pink-400 font-medium">
          print
        </span>
      );
      remaining = remaining.slice(5);
    }

    if (remaining.startsWith('(')) {
      parts.push(
        <span key="paren1" className="text-yellow-300">
          (
        </span>
      );
      remaining = remaining.slice(1);
    }

    if (remaining.startsWith('"')) {
      const endQuote = remaining.indexOf('"', 1);
      if (endQuote !== -1) {
        const str = remaining.slice(0, endQuote + 1);
        parts.push(
          <span key="string" className="text-green-400">
            {str}
          </span>
        );
        remaining = remaining.slice(endQuote + 1);
      } else {
        parts.push(
          <span key="string-partial" className="text-green-400">
            {remaining}
          </span>
        );
        remaining = '';
      }
    }

    if (remaining.startsWith(')')) {
      parts.push(
        <span key="paren2" className="text-yellow-300">
          )
        </span>
      );
      remaining = remaining.slice(1);
    }

    if (remaining) {
      parts.push(
        <span key="remaining" className="text-slate-300">
          {remaining}
        </span>
      );
    }

    return parts;
  };

  const cursorClass = prefersReducedMotion || !isActive ? 'opacity-0' : 'animate-blink';

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#2d2d2d] border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-colors cursor-pointer" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs font-medium text-slate-400">{terminalTitle}</span>
          </div>
          <div className="w-[68px]" />
        </div>

        <div className="bg-[#1e1e1e]">
          <div className="grid grid-cols-[max-content_1fr] font-mono text-[15px] leading-relaxed">
            <div className="py-6 px-4 bg-[#1a1a1a] text-slate-600 select-none border-r border-[#2d2d2d]">
              <div>1</div>
            </div>

            <div className="py-6 px-6">
              <div className="flex items-start">
                <span className="text-pink-500 mr-2">›</span>
                <div className="flex items-center">
                  {renderHighlightedCode(typedText)}
                  <span className={`inline-block w-2 h-5 bg-slate-400 ml-0.5 ${cursorClass}`} />
                </div>
              </div>

              <style>{`
                @keyframes blink {
                  0%, 50% { opacity: 1; }
                  51%, 100% { opacity: 0; }
                }
                .animate-blink {
                  animation: blink 1s step-end infinite;
                }
              `}</style>
            </div>

            <div
              className="bg-[#1a1a1a] border-r border-[#2d2d2d]"
              aria-hidden="true"
            />

            <div className="px-6 pb-6">
              <div className="relative rounded-lg overflow-hidden border-2 border-[#2d2d2d] shadow-lg">
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full aspect-[16/10] object-cover"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-xl -z-10 blur-2xl" />
    </div>
  );
}
