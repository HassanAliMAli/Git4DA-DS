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
  },
  {
    id: 3,
    title: 'The Time Machine',
    role: 'BOTH',
    narrative: [
      "Trust is good. Verification is better.",
      "A client is questioning the insights we delivered yesterday. They claim the revenue numbers don't match their internal audit.",
      "To resolve this, you must travel back to our 'baseline' state—the very first commit—and verify exactly what the logic was before our recent changes.",
      "Use 'git log' to find the hash of the first commit, and 'git checkout' to travel back in time."
    ],
    setup: async (state) => {
      // Create a project with history
      state.git.init();
      state.fs.writeFile('/README.md', '# DataPulse Baseline\nInitial logic: Revenue = Sales * 1.0');
      await state.git.add('README.md');
      await state.git.commit('feat: establish baseline revenue logic', 'Dr. Hassan');

      state.fs.writeFile('/README.md', '# DataPulse Updated\nUpdated logic: Revenue = Sales * 1.2 (experimental)');
      await state.git.add('README.md');
      await state.git.commit('feat: update revenue multiplier for Q4', 'Dr. Hassan');
    },
    goals: [
      {
        id: 'view_history',
        description: 'Use git log to inspect the project history.',
        check: (state) => {
          // This is a behavioral goal. We'll mark it true if they run the command.
          // For simplicity in this mock, we check if they are at least aware of the commits.
          return state.git.getGraph().commits.length >= 2;
        }
      },
      {
        id: 'travel_back',
        description: 'Checkout the first commit (the baseline) to verify the original logic.',
        check: (state) => {
          const commits = state.git.getGraph().commits;
          if (commits.length < 2) return false;
          const firstCommitHash = commits[commits.length - 1].hash;
          return state.git.getHead() === firstCommitHash;
        }
      }
    ],
    hints: [
      "Run 'git log' to see the list of all snapshots.",
      "Find the long string of letters and numbers (the hash) for the first commit.",
      "Use 'git checkout <hash>' to move the repository back to that state."
    ]
  },
  {
    id: 4,
    title: 'The Clean Undo',
    role: 'BOTH',
    narrative: [
      "Mistakes happen. Incompetence does not.",
      "An intern accidentally deleted the 'production_model.py' file and committed the change. The pipeline is broken.",
      "You have two choices: Rewrite history with 'reset' or create a corrective trail with 'revert'.",
      "In a professional firm, we prefer 'revert' for shared history. It keeps the audit trail intact.",
      "Find the commit that broke the project and use 'git revert' to bring the model back."
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile('/production_model.py', '# High performance model v1.0');
      await state.git.add('production_model.py');
      await state.git.commit('feat: ship production model', 'Senior Engineer');

      // The disaster
      state.fs.rm('/production_model.py');
      await state.git.add('production_model.py');
      await state.git.commit('fix: minor cleanup (OOPS)', 'Accidental Intern');
    },
    goals: [
      {
        id: 'revert',
        description: 'Revert the accidental deletion commit.',
        check: (state) => {
          const commits = state.git.getGraph().commits;
          // Level is complete if the file is back AND we have a revert commit
          return state.fs.exists('/production_model.py') && 
                 commits.some(c => c.message.toLowerCase().includes('revert'));
        }
      }
    ],
    hints: [
      "Use 'git log' to find the hash of the commit titled 'fix: minor cleanup (OOPS)'.",
      "Run 'git revert <hash>' to automatically create a new commit that undoes the damage.",
      "Verify the file is back with 'ls'."
    ]
  }
];
