"use client";

import React from 'react';
import { Database, FileCode } from 'lucide-react';

interface SQLViewerProps {
  content: string;
  fileName: string;
}

export function SQLViewer({ content, fileName }: SQLViewerProps) {
  // Enhanced syntax highlighting for Ink/Sage aesthetic
  const highlightSQL = (text: string) => {
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 'JOIN', 'LEFT JOIN', 
      'RIGHT JOIN', 'INNER JOIN', 'ON', 'AS', 'AND', 'OR', 'IN', 'IS NULL', 'NOT NULL',
      'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'WITH', 'CREATE', 'TABLE', 'VIEW'
    ];
    
    let highlighted = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      // Using Sage color for keywords
      highlighted = highlighted.replace(regex, `<span class="text-sage font-bold uppercase">${keyword}</span>`);
    });
    
    return highlighted;
  };

  return (
    <div className="bg-ink-2/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-glow h-full flex flex-col font-mono">
      <div className="px-5 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
          <Database size={14} className="text-sage" />
          SQL Logic Forge
        </div>
        <span className="text-[9px] font-mono text-zinc-500 italic">
          {fileName}
        </span>
      </div>
      
      <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
        <div className="bg-ink-3/40 rounded-xl p-5 border border-white/[0.02]">
          <pre className="text-[13px] leading-relaxed text-zinc-300">
            <code 
              dangerouslySetInnerHTML={{ __html: highlightSQL(content) }} 
            />
          </pre>
        </div>
      </div>

      <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-600 uppercase tracking-widest italic font-bold">
          <FileCode size={10} />
          Validation: Nominal • Query Optimized
        </div>
      </div>
    </div>
  );
}
