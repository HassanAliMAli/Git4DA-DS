import { UserRole } from '@/models/Profile';

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
      "In a professional firm, we NEVER commit raw datasets or credentials to our history.",
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
          return !state.git.getGraph().commits[0].message.includes('crime');
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
      "A client is questioning the insights we delivered yesterday.",
      "To resolve this, you must travel back to our 'baseline' state—the very first commit.",
      "Use 'git log' to find the hash of the first commit, and 'git checkout' to travel back in time."
    ],
    setup: async (state) => {
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
        check: (state) => state.git.getGraph().commits.length >= 2
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
      "An intern accidentally deleted the 'production_model.py' file. The pipeline is broken.",
      "In a professional firm, we prefer 'revert' for shared history. It keeps the audit trail intact.",
      "Find the commit that broke the project and use 'git revert' to bring the model back."
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile('/production_model.py', '# High performance model v1.0');
      await state.git.add('production_model.py');
      await state.git.commit('feat: ship production model', 'Senior Engineer');

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
          return state.fs.exists('/production_model.py') && 
                 commits.some(c => c.message.toLowerCase().includes('revert'));
        }
      }
    ],
    hints: [
      "Use 'git log' to find the hash of the commit titled 'fix: minor cleanup (OOPS)'.",
      "Run 'git revert <hash>' to automatically create a new commit that undoes the damage."
    ]
  },
  {
    id: 5,
    title: 'Branching for Hypotheses',
    role: 'BOTH',
    narrative: [
      "Linear thinking is for robots. Professionals work in parallel.",
      "We need to test a new 'Linear Regression' model. Create a branch named 'experiment-v2'.",
      "Switch to it, and take your first experimental snapshot."
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile('/README.md', '# Churn Analysis Project');
      await state.git.add('README.md');
      await state.git.commit('feat: init project', 'Dr. Hassan');
    },
    goals: [
      {
        id: 'create_branch',
        description: 'Create a new branch named experiment-v2.',
        check: (state) => state.git.getBranches().has('experiment-v2')
      },
      {
        id: 'checkout_branch',
        description: 'Switch (checkout) to the experiment-v2 branch.',
        check: (state) => state.git.getHead() === 'experiment-v2'
      },
      {
        id: 'experimental_commit',
        description: 'Make a commit on the new branch.',
        check: (state) => state.git.getGraph().commits.length >= 2 && state.git.getHead() === 'experiment-v2'
      }
    ],
    hints: [
      "Use 'git branch experiment-v2' to create the workspace.",
      "Use 'git checkout experiment-v2' to enter it."
    ]
  },
  {
    id: 6,
    title: 'The Remote Registry',
    role: 'BOTH',
    narrative: [
      "Insights locked on a single machine are liabilities.",
      "We use the 'Central Registry' (origin) to synchronize our analytical models.",
      "You've completed the Q4 revenue report. Publish it to the firm's registry.",
      "Use 'git push' to export your local snapshots to the 'origin' remote."
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile('/revenue_q4.sql', 'SELECT SUM(amount) FROM sales WHERE quarter = 4;');
      await state.git.add('revenue_q4.sql');
      await state.git.commit('feat: finalize Q4 revenue logic', 'Dr. Hassan');
    },
    goals: [
      {
        id: 'push_work',
        description: 'Push your master branch to the origin remote.',
        check: (state) => {
          const remoteBranches = state.git.getRemoteBranches('origin');
          return remoteBranches.has('master') && remoteBranches.get('master') === state.git.getCurrentCommit();
        }
      }
    ],
    hints: [
      "Use 'git push origin master' to upload your work."
    ]
  },
  {
    id: 7,
    title: 'The Conflict Resolution',
    role: 'BOTH',
    narrative: [
      "In a global firm, collisions are inevitable.",
      "A colleague has already updated the 'revenue_q4.sql' file in the Central Registry. You have also made local changes.",
      "When you try to 'merge' their work into yours, Git will hit a 'Conflict'. The data doesn't align.",
      "Your task: Resolve the conflict manually by editing the file to keep the best logic from both sides, then commit the resolved state."
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile('/revenue_q4.sql', 'SELECT SUM(amount) FROM sales;');
      await state.git.add('revenue_q4.sql');
      await state.git.commit('feat: init revenue script', 'Dr. Hassan');

      // Create a conflicting branch 'colleague-work'
      await state.git.branch('colleague-work');
      state.git.checkout('colleague-work');
      state.fs.writeFile('/revenue_q4.sql', 'SELECT SUM(amount) * 1.05 FROM sales; -- Colleague added tax');
      await state.git.add('revenue_q4.sql');
      await state.git.commit('feat: add tax adjustment', 'Colleague');

      // Back to master to make our own change
      state.git.checkout('master');
      state.fs.writeFile('/revenue_q4.sql', 'SELECT SUM(amount) FROM sales WHERE region = \"US\"; -- Our local filter');
      await state.git.add('revenue_q4.sql');
      await state.git.commit('feat: filter by US region', 'User');
    },
    goals: [
      {
        id: 'trigger_conflict',
        description: "Attempt to merge 'colleague-work' and trigger a conflict.",
        check: (state) => state.fs.readFile('/revenue_q4.sql').includes('<<<<<<<')
      },
      {
        id: 'resolve_conflict',
        description: 'Edit the file to remove markers and keep valid SQL, then commit.',
        check: (state) => {
          const content = state.fs.readFile('/revenue_q4.sql');
          const commits = state.git.getGraph().commits;
          return !content.includes('<<<<<<<') && 
                 commits.some(c => c.message.toLowerCase().includes('merge') || c.message.toLowerCase().includes('resolve'));
        }
      }
    ],
    hints: [
      "Run 'git merge colleague-work' to start the process.",
      "Open the 'revenue_q4.sql' file in your mind (or use 'ls' and 'cat' logic) and edit it to remove the HEAD and colleague markers.",
      "Once the file is clean, 'git add' it and 'git commit' to finish the merge."
    ]
  },
  {
    id: 8,
    title: 'The Logic Audit',
    role: 'BOTH',
    narrative: [
      "Conflict resolved. But precision is not optional.",
      "In this firm, no code touches the production registry without a second pair of eyes.",
      "You must now publish your resolved work and open a 'Pull Request' (PR) for my personal audit.",
      "I will review your logic, your test coverage, and your data lineage before I sign the merge.",
      "Use 'git push origin master' to upload your resolution, then run 'git pr open' to initiate the audit."
    ],
    setup: async (state) => {
      // Setup state with a resolved but unpushed conflict
      state.git.init();
      state.fs.writeFile('/revenue_q4.sql', 'SELECT SUM(amount) * 1.05 FROM sales WHERE region = \"US\";');
      await state.git.add('revenue_q4.sql');
      await state.git.commit('feat: resolve revenue logic conflict', 'User');
    },
    goals: [
      {
        id: 'push_resolved',
        description: 'Push your resolved work to the origin remote.',
        check: (state) => {
          const remoteBranches = state.git.getRemoteBranches('origin');
          return remoteBranches.has('master') && remoteBranches.get('master') === state.git.getCurrentCommit();
        }
      },
      {
        id: 'open_pr',
        description: "Use 'git pr open' to submit your work for Dr. Hassan's audit.",
        check: (state) => state.prOpened === true
      }
    ],
    hints: [
      "Ensure you have pushed with 'git push origin master'.",
      "Run the custom command 'git pr open' to trigger the review interface."
    ]
  }
];
