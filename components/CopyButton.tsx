'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#122620] text-white text-xs font-semibold hover:bg-[#1a382f] transition-all shrink-0"
    >
      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
      <span>{copied ? 'Copié !' : 'Copier'}</span>
    </button>
  );
}
