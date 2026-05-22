'use client';

import React, { useState, useEffect } from 'react';
import styles from './DrHassanAdvisor.module.css';

interface DrHassanAdvisorProps {
  messages: string[];
  onComplete?: () => void;
  autoStart?: boolean;
}

const DrHassanAdvisor: React.FC<DrHassanAdvisorProps> = ({ 
  messages, 
  onComplete, 
  autoStart = true 
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(autoStart);

  useEffect(() => {
    if (!hasStarted || currentMessageIndex >= messages.length) return;

    let currentIndex = 0;
    const fullText = messages[currentMessageIndex];
    setDisplayText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayText((prev) => prev + fullText[currentIndex]);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30); // Speed of the typewriter

    return () => clearInterval(interval);
  }, [currentMessageIndex, messages, hasStarted]);

  const handleNext = () => {
    if (isTyping) {
      // Skip typewriter and show full text
      setDisplayText(messages[currentMessageIndex]);
      setIsTyping(false);
      return;
    }

    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex((prev) => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  if (!hasStarted) return null;

  return (
    <div className={styles.container} aria-live="polite">
      <div className={styles.avatar}>
        <div className={styles.avatarInner}>H</div>
        <div className={styles.statusDot}></div>
      </div>
      
      <div className={styles.bubble}>
        <div className={styles.speakerName}>Dr. Hassan</div>
        <div className={styles.messageText}>
          {displayText}
          {isTyping && <span className={styles.cursor}>|</span>}
        </div>
        
        {!isTyping && (
          <button 
            onClick={handleNext} 
            className={styles.nextBtn}
            aria-label={currentMessageIndex === messages.length - 1 ? "Finish" : "Next message"}
          >
            {currentMessageIndex === messages.length - 1 ? 'Acknowledged' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
};

export default DrHassanAdvisor;
