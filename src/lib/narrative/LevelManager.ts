import { UserRole } from "@/models/Profile";
import { MODULE_1_LEVELS } from "./levels/Module1";
import { MODULE_2_LEVELS } from "./levels/Module2";
import { MODULE_3A_LEVELS } from "./levels/Module3A";
import { MODULE_3B_LEVELS } from "./levels/Module3B";
import { MODULE_4_LEVELS } from "./levels/Module4";
import { MODULE_5_LEVELS } from "./levels/Module5";

/**
 * Level Validation Engine
 *
 * ARCHITECTURAL PHILOSOPHY:
 * The LevelManager drives the narrative progression of the simulation. 
 * Unlike a simple tutorial, each 'Level' is a stateful sandbox.
 *
 * Key Pillars:
 * 1. Scenario Isolation: The `setup` function handles VFS/Git initialization, 
 *    ensuring each level starts with the exact technical context required.
 * 2. Result-Based Validation: We audit the *actual outcome* of user commands 
 *    (e.g., inspecting the VFS tree or the Git DAG) rather than simply 
 *    checking for specific command strings. This ensures the user actually 
 *    achieved the goal.
 * 3. Role-Aware Curriculum: The engine dynamically switches between Analyst 
 *    and Scientist tracks (Module 3A/3B), providing a personalized technical journey.
 */

/**
 * Defines a specific mission objective.
 */
export interface LevelGoal {
  id: string; // Machine-readable unique identifier
  description: string; // Human-readable label for the UI
  /**
   * The validation audit. 
   * @param state The current holistic state of the simulation workstation.
   * @returns true if the goal is satisfied.
   */
  check: (state: {
    fs: import("@/lib/vfs/FileSystem").FileSystem;
    git: import("@/lib/git/GitRepository").GitRepository;
    prOpened?: boolean;
  }) => boolean;
}

/**
 * Defines the complete structure of a narrative mission.
 */
export interface LevelDefinition {
  id: number; // The progression index (1-20)
  title: string; // The evocative mission name
  role: UserRole | "BOTH"; // Target audience filter
  narrative: string[]; // Dr. Hassan's sequence of messages
  /**
   * Scenario Bootstrapper: Provisions the VFS and Git DAG.
   */
  setup: (state: {
    fs: import("@/lib/vfs/FileSystem").FileSystem;
    git: import("@/lib/git/GitRepository").GitRepository;
    prOpened?: boolean;
  }) => Promise<void>;
  goals: LevelGoal[]; // The technical requirements for completion
  hints: string[]; // Progressive technical guidance
  helpMessage?: string; // Dr. Hassan's full explanation and commands
}

/**
 * The Global Level Registry
 * Aggregates modularized curricula into a single progression timeline.
 */
export const LEVELS: LevelDefinition[] = [
  ...MODULE_1_LEVELS, // Foundation
  ...MODULE_2_LEVELS, // Collaboration
  ...MODULE_3A_LEVELS, // Specialized Analyst Track
  ...MODULE_3B_LEVELS, // Specialized Scientist Track
  ...MODULE_4_LEVELS, // Big Tech Scale
  ...MODULE_5_LEVELS, // Dark Arts (GPG, Reflog, Worktrees)
];
