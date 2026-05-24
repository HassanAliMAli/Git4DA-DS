/**
 * User Identity & Progression Model
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Defines the 'Technical Lineage' of the operative. This model is 
 * shared between the state Context and the persistence layer.
 * 
 * In the Git4Data universe, identity is tied to a specific career 
 * trajectory (Analyst vs Scientist), which dictates the modular 
 * curricula they encounter.
 */

/**
 * Career Path trajectories.
 * ANALYST: Focuses on SQL, dbt, and BI synchronization.
 * SCIENTIST: Focuses on MLOps, DVC, and Experiment tracking.
 */
export type UserRole = "DATA_ANALYST" | "DATA_SCIENTIST";

/**
 * Holistic Operative Profile
 */
export interface UserProfile {
  id: string; // Cryptographic unique identifier
  name: string; // Technical designation
  role: UserRole; // Assigned trajectory
  xp: number; // Cumulative merit points
  level: number; // Current narrative progression index
  unlockedThemes: string[]; // Progression-based UI customizations
  achievements: string[]; // Earned technical badges (e.g. 'GPG_SIGNER')
  createdAt: string; // ISO-8601 creation anchor
  updatedAt: string; // ISO-8601 last-save anchor
}

/**
 * Prototype for a fresh operative registration.
 */
export const INITIAL_PROFILE: Partial<UserProfile> = {
  xp: 0,
  level: 1,
  unlockedThemes: ["default"],
  achievements: [],
};
