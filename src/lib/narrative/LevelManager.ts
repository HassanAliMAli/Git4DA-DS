import { UserRole } from '@/models/Profile';
import { MODULE_1_LEVELS } from './levels/Module1';
import { MODULE_2_LEVELS } from './levels/Module2';
import { MODULE_3_LEVELS } from './levels/Module3';

export interface LevelGoal {
  id: string;
  description: string;
  check: (state: { fs: import("@/lib/vfs/FileSystem").FileSystem, git: import("@/lib/git/GitRepository").GitRepository, prOpened?: boolean }) => boolean;
}

export interface LevelDefinition {
  id: number;
  title: string;
  role: UserRole | 'BOTH';
  narrative: string[];
  setup: (state: { fs: import("@/lib/vfs/FileSystem").FileSystem, git: import("@/lib/git/GitRepository").GitRepository, prOpened?: boolean }) => Promise<void>;
  goals: LevelGoal[];
  hints: string[];
}

export const LEVELS: LevelDefinition[] = [
  ...MODULE_1_LEVELS,
  ...MODULE_2_LEVELS,
  ...MODULE_3_LEVELS
];
