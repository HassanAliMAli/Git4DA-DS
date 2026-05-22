'use client';

import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import ProfileSelection from '@/components/ProfileSelection';
import DrHassanAdvisor from '@/components/DrHassanAdvisor';
import dialogueData from '@/levels/dialogue.json';
import styles from './page.module.css';

export default function Home() {
  const { profile, isLoaded } = useProfile();
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [isTerminalCalibrating, setIsTerminalCalibrating] = useState(false);

  if (!isLoaded) {
    return <div className={styles.loading}>Initializing DataPulse HQ...</div>;
  }

  if (!profile) {
    return <ProfileSelection />;
  }

  const welcomeMessages = dialogueData.welcome[profile.role];

  const handleStart = () => {
    setShowAdvisor(true);
  };

  const onAdvisorComplete = () => {
    setIsTerminalCalibrating(true);
    // Logic to move to the first level will go here
    console.log("Terminal Calibrated. Entering Level 1...");
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.roleLabel}>{profile.role.replace('_', ' ')}</span>
          <h1 className={styles.userName}>{profile.name}</h1>
          <div className={styles.stats}>
            <span>XP: {profile.xp}</span>
            <span>Level: {profile.level}</span>
          </div>
        </div>
      </header>

      <section className={styles.content}>
        <div className={styles.welcomeCard}>
          <h2>Welcome to DataPulse, {profile.name.split(' ')[0]}.</h2>
          <p>
            {isTerminalCalibrating 
              ? 'Calibrating environment... Simulation start imminent.' 
              : `Your ${profile.role === 'DATA_ANALYST' ? 'Analysis' : 'Research'} track is ready for initialization.`
            }
          </p>
          {!showAdvisor && !isTerminalCalibrating && (
            <button className={styles.startBtn} onClick={handleStart}>
              Initialize Connection
            </button>
          )}
        </div>
      </section>

      {showAdvisor && (
        <DrHassanAdvisor 
          messages={welcomeMessages} 
          onComplete={onAdvisorComplete}
        />
      )}
    </main>
  );
}
