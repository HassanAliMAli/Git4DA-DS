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
      <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 font-mono text-xs flex items-start gap-3">
        <Info size={16} />
        <span>Malformed Research Artifact: {fileName}. JSON parsing failure.</span>
      </div>
    );
  }

  return (
    <div className="bg-ink-2/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-glow h-full flex flex-col">
      <div className="px-5 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
          <BookText size={14} className="text-violet-400" />
          Research Notebook
        </div>
        <span className="text-[9px] font-mono text-zinc-500 italic">
          {fileName}
        </span>
      </div>
      
      <div className="p-6 overflow-y-auto flex-1 space-y-8 scrollbar-hide">
        {cells.map((cell, idx) => (
          <div key={idx} className="relative group">
            {/* Cell Type Badge */}
            <div className="absolute -top-3 right-4 px-2 py-0.5 rounded bg-ink border border-white/10 text-[8px] font-bold text-zinc-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {cell.cell_type}
            </div>

            <div className={`p-4 rounded-xl border-l-2 transition-colors ${
              cell.cell_type === 'code' 
                ? 'bg-ink/60 border-sage/40 hover:border-sage' 
                : 'bg-transparent border-zinc-800 hover:border-zinc-700'
            }`}>
              <div className="flex gap-4">
                {cell.cell_type === 'code' && (
                  <div className="text-[10px] font-mono text-zinc-600 w-6 pt-1 text-right select-none">
                    [{cell.execution_count || ' '}]
                  </div>
                )}
                <div className={`flex-1 font-mono text-[13px] leading-relaxed ${
                  cell.cell_type === 'code' ? 'text-zinc-200' : 'text-zinc-400 italic'
                }`}>
                  {cell.source.map((line, lIdx) => (
                    <div key={lIdx} className="min-h-[1.2em]">{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-600 uppercase tracking-widest italic">
          <Code2 size={10} />
          Artifact verified via G4D Kernel
        </div>
      </div>
    </div>
  );
}
