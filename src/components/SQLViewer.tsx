"use client";

import React from 'react';
import { Database, FileCode } from 'lucide-react';

interface SQLViewerProps {
  content: string;
  fileName: string;
}

export function SQLViewer({ content, fileName }: SQLViewerProps) {
  const highlightSQL = (text: string) => {
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 'JOIN', 'LEFT JOIN', 
      'RIGHT JOIN', 'INNER JOIN', 'ON', 'AS', 'AND', 'OR', 'IN', 'IS NULL', 'NOT NULL',
      'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'WITH', 'CREATE', 'TABLE', 'VIEW'
    ];
    
    let highlighted = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="text-gh-blue font-black uppercase">${keyword}</span>`);
    });
    
    return highlighted;
  };

  return (
    <div className="bg-ink-2 border border-gh-border rounded-[24px] overflow-hidden shadow-terminal h-full flex flex-col font-mono italic">
      <div className="px-6 py-5 bg-ink-3 border-b border-gh-border flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] font-black text-gh-text-sec uppercase tracking-[0.3em]">
          <Database size={16} className="text-gh-blue" />
          SQL Logic Forge
        </div>
        <span className="text-[10px] font-mono text-zinc-600 font-bold italic tracking-tighter">
          {fileName}
        </span>
      </div>
      
      <div className="p-8 overflow-y-auto flex-1 scrollbar-hide">
        <div className="bg-ink rounded-3xl p-8 border border-white/[0.02] shadow-inner relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gh-blue/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <pre className="text-[14px] leading-relaxed text-gh-text font-bold relative z-10">
            <code 
              dangerouslySetInnerHTML={{ __html: highlightSQL(content) }} 
            />
          </pre>
        </div>
      </div>

      <div className="px-6 py-4 bg-ink-3 border-t border-gh-border flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em] font-black">
          <FileCode size={12} className="text-gh-green" />
          Linear Logic Validated
        </div>
      </div>
    </div>
  );
}
