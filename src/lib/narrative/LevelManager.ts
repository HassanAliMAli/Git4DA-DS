import { UserRole } from "@/models/Profile";
import { MODULE_1_LEVELS } from "./levels/Module1";
import { MODULE_2_LEVELS } from "./levels/Module2";
import { MODULE_3_LEVELS } from "./levels/Module3";
import { MODULE_4_LEVELS } from "./levels/Module4";
import { MODULE_5_LEVELS } from "./levels/Module5";

/**
 * Level Validation Engine
 *
 * ARCHITECTURAL PHILOSOPHY:
 * The LevelManager drives the narrative progression of the simulation. Each 'Level'
 * is not merely a task list, but an isolated, stateful scenario.
 *
 * Validation Architecture:
 * - Every goal defines a `check` function that receives the active FileSystem (VFS)
 *   and GitRepository state.
 * - The engine continuously evaluates these functions against the VFS after every
 *   terminal input.
 * - This allows the system to verify the *actual outcome* (e.g. "Does the file exist?",
 *   "Is the commit in the log?") rather than simply regex-matching the user's input,
 *   ensuring true, PhD-level rigor.
 */

export interface LevelGoal {
  id: string;
  description: string;
  check: (state: {
    fs: import("@/lib/vfs/FileSystem").FileSystem;
    git: import("@/lib/git/GitRepository").GitRepository;
    prOpened?: boolean;
  }) => boolean;
}

export interface LevelDefinition {
  id: number;
  title: string;
  role: UserRole | "BOTH";
  narrative: string[];
  setup: (state: {
    fs: import("@/lib/vfs/FileSystem").FileSystem;
    git: import("@/lib/git/GitRepository").GitRepository;
    prOpened?: boolean;
  }) => Promise<void>;
  goals: LevelGoal[];
  hints: string[];
}

export const LEVELS: LevelDefinition[] = [
  ...MODULE_1_LEVELS,
  ...MODULE_2_LEVELS,
  ...MODULE_3_LEVELS,
  ...MODULE_4_LEVELS,
  ...MODULE_5_LEVELS,
];
