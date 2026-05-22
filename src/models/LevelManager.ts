import { UserRole } from './Profile';

export interface LevelGoal {
  id: string;
  description: string;
  check: (state: any) => boolean;
}

export interface LevelDefinition {
  id: number;
  title: string;
  role: UserRole | 'BOTH';
  narrative: string[];
  setup: (state: any) => Promise<void>;
  goals: LevelGoal[];
  hints: string[];
}

export const LEVELS: LevelDefinition[] = [
  {
    id: 1,
    title: 'The First Snapshot',
    role: 'BOTH',
    narrative: [
      "Welcome to your first day. I'm Hassan, and I expect precision.",
      "Your first task is simple, yet critical: initialize our core registry.",
      "Professional work starts with a clean slate. Use 'git init' and create your first commit."
    ],
    setup: async (state) => {
      // Create a dummy starting file
      state.fs.writeFile('/README.md', '# DataPulse Project\nInitialization pending...');
    },
    goals: [
      {
        id: 'init',
        description: 'Initialize a new git repository.',
        check: (state) => state.git.getBranches().size > 0
      },
      {
        id: 'commit',
        description: 'Create your first commit with a meaningful message.',
        check: (state) => state.git.getGraph().commits.length > 0
      }
    ],
    hints: [
      "Use 'git init' to start the repository.",
      "Add files with 'git add README.md'.",
      "Commit your changes with 'git commit -m \"feat: initialize project\"'."
    ]
  }
];
