'use client';

import React from 'react';
import styles from './NotebookViewer.module.css';

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

const NotebookViewer: React.FC<NotebookViewerProps> = ({ content, fileName }) => {
  let cells: NotebookCell[] = [];
  
  try {
    const data = JSON.parse(content);
    cells = data.cells || [];
  } catch (e) {
    return <div className={styles.error}>Invalid Notebook Format: {fileName}</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.icon}>📓</span>
        <h3 className={styles.fileName}>{fileName}</h3>
      </header>
      
      <div className={styles.notebookBody}>
        {cells.map((cell, idx) => (
          <div key={idx} className={`${styles.cell} ${styles[cell.cell_type]}`}>
            <div className={styles.cellTypeLabel}>{cell.cell_type}</div>
            <div className={styles.cellContent}>
              {cell.source.map((line, lIdx) => (
                <div key={lIdx} className={styles.line}>{line}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotebookViewer;
