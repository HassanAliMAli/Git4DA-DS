"use client";

import React from 'react';
import { BookText, Code2, Info } from 'lucide-react';

interface NotebookCell {
  cell_type: 'code' | 'markdown';
  source: string[];
  outputs?: any[];
  execution_count?: number;
}

interface NotebookViewerProps {
  content: string; // JSON string of the .ipynb file
  fileName: string;
}

export function NotebookViewer({ content, fileName }: NotebookViewerProps) {
  let cells: NotebookCell[] = [];
  
  try {
    const data = JSON.parse(content);
    cells = data.cells || [];
  } catch (e) {
    return (
      <div className="p-8 bg-gh-danger/10 border border-gh-danger/20 rounded-2xl text-gh-danger font-mono text-[11px] flex items-start gap-4 italic font-bold">
        <Info size={18} />
        <span>[FATAL_ERROR]: MALFORMED RESEARCH ARTIFACT. {fileName.toUpperCase()} PARSING FAILURE.</span>
      </div>
    );
  }

  return (
    <div className="bg-ink-2 border border-gh-border rounded-[24px] overflow-hidden shadow-terminal h-full flex flex-col font-sans italic">
      <div className="px-6 py-5 bg-ink-3 border-b border-gh-border flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] font-black text-gh-text-sec uppercase tracking-[0.3em]">
          <BookText size={16} className="text-violet-400" />
          Research Notebook
        </div>
        <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-widest">
          {fileName}
        </span>
      </div>
      
      <div className="p-8 overflow-y-auto flex-1 space-y-10 scrollbar-hide">
        {cells.map((cell, idx) => (
          <div key={idx} className="relative group">
            <div className={`p-5 rounded-[20px] border-l-4 transition-all duration-300 ${
              cell.cell_type === 'code' 
                ? 'bg-ink border-gh-blue/40 group-hover:border-gh-blue' 
                : 'bg-transparent border-white/5 group-hover:border-white/10'
            }`}>
              <div className="flex gap-6">
                {cell.cell_type === 'code' && (
                  <div className="text-[11px] font-mono text-zinc-800 w-8 pt-1 text-right select-none font-black">
                    [{cell.execution_count || ' '}]
                  </div>
                )}
                <div className={`flex-1 font-mono text-[13px] leading-relaxed tracking-tight ${
                  cell.cell_type === 'code' ? 'text-gh-text font-bold' : 'text-zinc-600 font-light'
                }`}>
                  {cell.source.map((line, lIdx) => (
                    <div key={lIdx} className="min-h-[1.5em]">{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-ink-3 border-t border-gh-border flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em] font-black">
          <Code2 size={12} className="text-gh-blue" />
          Artifact Analysis Verified
        </div>
      </div>
    </div>
  );
}
