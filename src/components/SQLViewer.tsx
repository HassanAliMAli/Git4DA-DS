'use client';

import React from 'react';
import styles from './SQLViewer.module.css';

interface SQLViewerProps {
  content: string;
  fileName: string;
}

const SQLViewer: React.FC<SQLViewerProps> = ({ content, fileName }) => {
  // Simple syntax highlighting simulation
  const highlightSQL = (text: string) => {
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 'JOIN', 'LEFT JOIN', 
      'RIGHT JOIN', 'INNER JOIN', 'ON', 'AS', 'AND', 'OR', 'IN', 'IS NULL', 'NOT NULL',
      'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'WITH', 'CREATE', 'TABLE', 'VIEW'
    ];
    
    let highlighted = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="${styles.keyword}">${keyword}</span>`);
    });
    
    return highlighted;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.icon}>🗄️</span>
        <h3 className={styles.fileName}>{fileName}</h3>
      </header>
      
      <div className={styles.editor}>
        <pre className={styles.code}>
          <code 
            dangerouslySetInnerHTML={{ __html: highlightSQL(content) }} 
          />
        </pre>
      </div>
    </div>
  );
};

export default SQLViewer;
