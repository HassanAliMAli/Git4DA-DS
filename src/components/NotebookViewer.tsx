"use client";

import React from "react";
import { Play, FileCode, MessageSquare, Database } from "lucide-react";

interface NotebookCell {
  cell_type: "markdown" | "code";
  source: string[];
  outputs?: any[];
  execution_count?: number;
}

interface NotebookViewerProps {
  content: string; // JSON string of .ipynb
  filename: string;
}

/**
 * High-Fidelity Notebook Viewer
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Renders serialized Jupyter Notebooks as interactive visual components.
 * This is essential for the Data Scientist track, allowing users to "view" 
 * the experiments they are versioning without leaving the workstation.
 */
export const NotebookViewer: React.FC<NotebookViewerProps> = ({
  content,
  filename,
}) => {
  let notebook: { cells: NotebookCell[] } = { cells: [] };
  try {
    notebook = JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse notebook JSON", e);
  }

  return (
    <div className="bg-ink rounded-3xl border border-white/10 overflow-hidden shadow-2xl h-full flex flex-col font-sans">
      {/* Chrome Header */}
      <div className="px-6 py-4 bg-ink-2 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gh-blue/10 flex items-center justify-center text-gh-blue border border-gh-blue/20 shadow-glow">
            <FileCode size={16} />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black italic">
              IPython Experiment
            </div>
            <div className="text-white font-bold tracking-tight">{filename}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-zinc-500 uppercase tracking-widest italic">
             <span className="w-1.5 h-1.5 rounded-full bg-gh-green animate-pulse" />
             Kernel: Python 3.11
          </div>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-gh-blue text-white rounded-lg transition-all font-black text-[10px] uppercase italic tracking-widest shadow-glow hover:bg-blue-600">
            <Play size={10} fill="currentColor" /> Run All
          </button>
        </div>
      </div>

      {/* Cells Area */}
      <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-ink scrollbar-hide text-left">
        {notebook.cells.map((cell, idx) => (
          <div key={idx} className="flex items-start gap-6 group">
            <div className="w-12 text-right pt-2 shrink-0">
               <span className="text-[10px] font-mono font-black text-zinc-800 uppercase tracking-tighter group-hover:text-zinc-600 transition-colors">
                 [{cell.execution_count || ' '}]
               </span>
            </div>
            
            <div className={`flex-1 rounded-2xl border ${
              cell.cell_type === 'code' 
                ? 'bg-white/[0.02] border-white/5 p-6 shadow-inner' 
                : 'bg-transparent border-transparent px-2'
            }`}>
              {cell.cell_type === 'markdown' ? (
                <div className="flex items-start gap-4">
                   <MessageSquare size={14} className="text-gh-blue mt-1 shrink-0 opacity-40" />
                   <div className="text-white/80 text-[14px] leading-relaxed italic font-medium">
                     {cell.source.join('')}
                   </div>
                </div>
              ) : (
                <div className="font-mono text-[13px] text-white/90 whitespace-pre-wrap italic">
                  {cell.source.join('')}
                  {cell.outputs && cell.outputs.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/5 font-sans not-italic">
                       <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 italic">Output</div>
                       <div className="bg-ink rounded-xl p-4 border border-white/5 text-gh-green opacity-80 text-xs">
                          {cell.outputs[0].text ? cell.outputs[0].text.join('') : 'Object data rendered.'}
                       </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
           <Database size={300} className="text-gh-blue" />
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-ink-2 border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] italic text-zinc-600">
         <div className="flex gap-6">
           <span>Cells: {notebook.cells.length}</span>
           <span>Format: v4.5</span>
         </div>
         <div className="flex items-center gap-2">
            Audit: <span className="text-gh-blue">Stable</span>
         </div>
      </div>
    </div>
  );
};
