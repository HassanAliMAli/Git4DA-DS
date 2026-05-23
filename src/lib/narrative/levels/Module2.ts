import { LevelDefinition } from '../LevelManager';

export const MODULE_2_LEVELS: LevelDefinition[] = [
  {
    id: 5,
    title: 'Hypothesis Isolation',
    role: 'BOTH',
    narrative: [
      "A scientist who experiments on production data is an arsonist.",
      "We are launching a risky 'Deep Learning' experiment. If it fails, I don't want it poisoning our core registry.",
      "Isolate your work. Create a parallel workspace named 'experiment-dl-v1'.",
      "Make your experimental changes there. If the logic holds, we will talk about merging. If it breaks, we burn the branch.",
      "Isolation is the foundation of the scientific method."
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile('/README.md', '# Core Research Registry');
      await state.git.add('README.md');
      await state.git.commit('feat: init research registry', 'Dr. Hassan');
    },
    goals: [
      {
        id: 'create_branch',
        description: "Spin up the isolation workspace 'experiment-dl-v1'.",
        check: (state) => state.git.getBranches().has('experiment-dl-v1')
      },
      {
        id: 'checkout_branch',
        description: "Switch your focus to the experimental branch.",
        check: (state) => state.git.getHead() === 'experiment-dl-v1'
      },
      {
        id: 'experimental_commit',
        description: 'Take an experimental snapshot on the new branch.',
        check: (state) => state.git.getGraph().commits.length >= 2 && state.git.getHead() === 'experiment-dl-v1'
      }
    ],
    hints: [
      "Use 'git branch experiment-dl-v1' to prepare the space, then 'git checkout' to enter it."
    ]
  },
  {
    id: 6,
    title: 'The Central Registry',
    role: 'BOTH',
    narrative: [
      "Brilliance in a vacuum is useless. Data science is a team sport.",
      "Our local insights must flow to the 'Central Registry' (origin) to be validated by the firm's global pipeline.",
      "You've finalized the 'revenue_pipeline.sql'. It is time to synchronize.",
      "Publish your local master branch to the 'origin' server. Make your work visible to the world.",
      "A commit isn't 'done' until it is pushed."
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile('/revenue_pipeline.sql', 'SELECT sum(rev) FROM global_ledger;');
      await state.git.add('revenue_pipeline.sql');
      await state.git.commit('feat: finalize global revenue logic', 'Dr. Hassan');
    },
    goals: [
      {
        id: 'push_work',
        description: 'Synchronize your ledger with the origin remote.',
        check: (state) => {
          const remotes = state.git.getRemoteBranches('origin');
          return remotes.has('master') && remotes.get('master') === state.git.getCurrentCommit();
        }
      }
    ],
    hints: [
      "The command is 'git push origin master'. This uploads your local snapshots."
    ]
  },
  {
    id: 7,
    title: 'The Conflict Diplomacy',
    role: 'BOTH',
    narrative: [
      "Two operatives. One file. Zero agreement.",
      "You and a colleague both updated 'revenue_logic.sql' simultaneously. Git has hit a dead end—a 'Conflict'.",
      "This is not a failure. It is a moment for human judgment. Git cannot decide which math is 'better'. You must.",
      "Resolve the conflict by merging your US-region filtering with your colleague's tax logic. Commit the unified result.",
      "Engineering is 10% coding and 90% resolving differences."
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile('/revenue_logic.sql', 'SELECT total FROM sales;');
      await state.git.add('revenue_logic.sql');
      await state.git.commit('feat: init logic', 'Dr. Hassan');

      await state.git.branch('colleague-work');
      state.git.checkout('colleague-work');
      state.fs.writeFile('/revenue_logic.sql', 'SELECT total * 1.10 FROM sales; -- Added Tax');
      await state.git.add('revenue_logic.sql');
      await state.git.commit('feat: add tax', 'Colleague');

      state.git.checkout('master');
      state.fs.writeFile('/revenue_logic.sql', 'SELECT total FROM sales WHERE region = \"US\"; -- US Filter');
      await state.git.add('revenue_logic.sql');
      await state.git.commit('feat: add US filter', 'User');
    },
    goals: [
      {
        id: 'trigger_conflict',
        description: "Attempt to merge the colleague's work into master.",
        check: (state) => state.fs.readFile('/revenue_logic.sql').includes('<<<<<<<')
      },
      {
        id: 'resolve_conflict',
        description: 'Edit the file to unify the logic and commit the resolution.',
        check: (state) => {
          const content = state.fs.readFile('/revenue_logic.sql');
          return !content.includes('<<<<<<<') && 
                 state.git.getGraph().commits.some(c => c.message.toLowerCase().includes('merge') || c.message.toLowerCase().includes('resolve'));
        }
      }
    ],
    hints: [
      "Run 'git merge colleague-work'.",
      "Look for '<<<<<<<', '=======', and '>>>>>>>' markers in the file. Remove them and keep the SQL lines."
    ]
  },
  {
    id: 8,
    title: 'The Final Logic Audit',
    role: 'BOTH',
    narrative: [
      "The conflict is resolved. But the audit has just begun.",
      "At DataPulse, no code reaches production without my personal signature. We call this the 'Logic Audit'.",
      "Open a 'Pull Request' (PR). I will review your combined US filtering and tax math for statistical integrity.",
      "If your work survives my scrutiny, I will sign the merge. If not, you will iterate until it is perfect.",
      "Trust is earned through peer review. Open the PR now."
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile('/revenue_logic.sql', 'SELECT total * 1.10 FROM sales WHERE region = \"US\";');
      await state.git.add('revenue_logic.sql');
      await state.git.commit('feat: unified revenue logic', 'User');
    },
    goals: [
      {
        id: 'push_resolved',
        description: 'Upload your unified work to the audit server.',
        check: (state) => state.git.getRemoteBranches('origin').has('master')
      },
      {
        id: 'open_pr',
        description: "Initiate the audit (git pr open).",
        check: (state) => state.prOpened === true
      }
    ],
    hints: [
      "Push your work first, then run the custom command 'git pr open' to face Dr. Hassan's audit."
    ]
  }
];
