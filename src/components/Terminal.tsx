'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './Terminal.module.css';

interface TerminalProps {
  onCommand: (command: string) => Promise<string | void>;
  history: { type: 'command' | 'output' | 'error'; text: string }[];
}

const Terminal: React.FC<TerminalProps> = ({ onCommand, history }) => {
  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input;
    setInput('');
    await onCommand(cmd);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={styles.container} onClick={focusInput}>
      <div className={styles.header}>
        <div className={styles.dots}>
          <span className={styles.dot} style={{ backgroundColor: '#ff5f56' }}></span>
          <span className={styles.dot} style={{ backgroundColor: '#ffbd2e' }}></span>
          <span className={styles.dot} style={{ backgroundColor: '#27c93f' }}></span>
        </div>
        <div className={styles.title}>DataPulse Terminal — zsh</div>
      </div>
      
      <div className={styles.outputArea}>
        {history.map((entry, idx) => (
          <div key={idx} className={`${styles.line} ${styles[entry.type]}`}>
            {entry.type === 'command' && <span className={styles.prompt}>$ </span>}
            {entry.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <span className={styles.prompt}>$ </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default Terminal;
