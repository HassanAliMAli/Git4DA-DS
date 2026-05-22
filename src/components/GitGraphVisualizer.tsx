'use client';

import React from 'react';
import { GitCommit } from '@/models/GitRepository';
import styles from './GitGraphVisualizer.module.css';

interface GraphCommit extends GitCommit {
  hash: string;
}

interface GitGraphVisualizerProps {
  commits: GraphCommit[];
  branches: { name: string, hash: string }[];
  currentBranch: string;
}

const GitGraphVisualizer: React.FC<GitGraphVisualizerProps> = ({ 
  commits, 
  branches, 
  currentBranch 
}) => {
  if (commits.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No commit history found. Initialize your project to begin visualization.</p>
      </div>
    );
  }

  // Very simple vertical layout
  const spacing = 60;
  const dotRadius = 8;
  const startX = 50;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.icon}>🌳</span>
        <h3 className={styles.title}>Commit Lineage</h3>
      </header>

      <div className={styles.graphWrapper}>
        <svg width="100%" height={commits.length * spacing + 40}>
          {commits.map((commit, idx) => {
            const y = (idx + 1) * spacing;
            const nextCommit = commits[idx + 1];
            
            // Find branches pointing to this commit
            const pointingBranches = branches.filter(b => b.hash === commit.hash);

            return (
              <g key={commit.hash}>
                {/* Connection Line */}
                {commit.parent && nextCommit && (
                  <line 
                    x1={startX} y1={y} 
                    x2={startX} y2={y + spacing} 
                    className={styles.line} 
                  />
                )}
                
                {/* Commit Node */}
                <circle 
                  cx={startX} cy={y} r={dotRadius} 
                  className={`${styles.node} ${pointingBranches.some(b => b.name === currentBranch) ? styles.activeNode : ''}`}
                />

                {/* Commit Info */}
                <text x={startX + 30} y={y + 5} className={styles.commitMessage}>
                  {commit.message}
                </text>
                <text x={startX + 30} y={y + 20} className={styles.commitHash}>
                  {commit.hash.substring(0, 7)} — {commit.author}
                </text>

                {/* Branch Labels */}
                {pointingBranches.map((branch, bIdx) => (
                  <g key={branch.name} transform={`translate(${startX + 300}, ${y - 10})`}>
                    <rect 
                      width={branch.name.length * 8 + 20} height="20" rx="4" 
                      className={`${styles.branchTag} ${branch.name === currentBranch ? styles.activeTag : ''}`}
                    />
                    <text x="10" y="14" className={styles.branchText}>
                      {branch.name}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default GitGraphVisualizer;
