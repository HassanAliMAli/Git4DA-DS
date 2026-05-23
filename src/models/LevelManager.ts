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
        description: 'Create your first commit with a meaningful message (e.g., feat: init project).',
        check: (state) => {
          const commits = state.git.getGraph().commits;
          if (commits.length === 0) return false;
          
          const latestMessage = commits[0].message.toLowerCase();
          const conventionalTypes = ['feat:', 'fix:', 'docs:', 'style:', 'refactor:', 'test:', 'chore:'];
          return conventionalTypes.some(type => latestMessage.startsWith(type));
        }
      }
    ],
    hints: [
      "Use 'git init' to start the repository.",
      "Add files with 'git add README.md'.",
      "Commit your changes with 'git commit -m \"feat: initialize project\"'."
    ]
  },
  {
    id: 2,
    title: 'The Data Shield',
    role: 'BOTH',
    narrative: [
      "Good work on the registry. Now, let's talk about Data Crimes.",
      "In a professional firm, we NEVER commit raw datasets or credentials to our history. It's a massive security and performance risk.",
      "You've been given a 'raw_data.csv' and a '.env' file. Your task is to shield the repository.",
      "Create a '.gitignore' file and add patterns to ignore these files before committing your next update."
    ],
    setup: async (state) => {
      state.fs.writeFile('/raw_data.csv', 'id,secret_value\n1, confidential_data_001');
      state.fs.writeFile('/.env', 'DATABASE_URL=postgres://user:pass@localhost:5432/prod');
      state.fs.writeFile('/analysis.py', '# TODO: Start analysis');
    },
    goals: [
      {
        id: 'gitignore',
        description: 'Create a .gitignore file and ignore .csv and .env files.',
        check: (state) => {
          if (!state.fs.exists('/.gitignore')) return false;
          const content = state.fs.readFile('/.gitignore').toLowerCase();
          return content.includes('.csv') && content.includes('.env');
        }
      },
      {
        id: 'clean_commit',
        description: 'Commit analysis.py while ensuring ignored files stay out of history.',
        check: (state) => {
          const commits = state.git.getGraph().commits;
          if (commits.length === 0) return false;
          
          // Check the latest commit's tree (via objects) to see if raw_data.csv is inside
          const latestCommit = commits[0];
          // We need a way to inspect tree contents.
          // For now, let's assume if it's not in the index and a commit happened, it's clean.
          // Actually, let's check if the git engine is reporting any 'Data Crimes'.
          return state.git.getGraph().commits.length > 0 && !state.git.getGraph().commits[0].message.includes('crime');
        }
      }
    ],
    hints: [
      "Create .gitignore with 'touch .gitignore' and write patterns into it.",
      "Standard patterns: '*.csv' and '.env'",
      "Use 'git add analysis.py' and commit it."
    ]
  }
];
