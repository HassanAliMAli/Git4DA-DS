'use client';

import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { UserRole } from '@/models/Profile';
import styles from './ProfileSelection.module.css';

const ProfileSelection: React.FC = () => {
  const { setRole } = useProfile();
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && selectedRole) {
      setRole(selectedRole, name);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>DataPulse Analytics</h1>
          <p className={styles.subtitle}>Welcome to the Forge. Create your badge.</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              required
              className={styles.input}
            />
          </div>

          <div className={styles.roleGrid} role="group" aria-labelledby="role-selection-label">
            <span id="role-selection-label" className="sr-only">Choose your career track</span>
            
            <button
              type="button"
              className={`${styles.roleCard} ${selectedRole === 'DATA_ANALYST' ? styles.active : ''}`}
              onClick={() => setSelectedRole('DATA_ANALYST')}
              aria-pressed={selectedRole === 'DATA_ANALYST'}
            >
              <div className={styles.roleIcon} aria-hidden="true">📊</div>
              <h3 className={styles.roleTitle}>Data Analyst</h3>
              <p className={styles.roleDesc}>Master Logic & Insights</p>
            </button>

            <button
              type="button"
              className={`${styles.roleCard} ${selectedRole === 'DATA_SCIENTIST' ? styles.active : ''}`}
              onClick={() => setSelectedRole('DATA_SCIENTIST')}
              aria-pressed={selectedRole === 'DATA_SCIENTIST'}
            >
              <div className={styles.roleIcon} aria-hidden="true">🧪</div>
              <h3 className={styles.roleTitle}>Data Scientist</h3>
              <p className={styles.roleDesc}>Master Models & Production</p>
            </button>
          </div>

          <button
            type="submit"
            disabled={!name || !selectedRole}
            className={styles.submitBtn}
          >
            Issue Badge
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSelection;
