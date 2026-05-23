import { LevelDefinition } from "../LevelManager";

export const MODULE_5_LEVELS: LevelDefinition[] = [
  {
    id: 17,
    title: "The Reflog Resurrection",
    role: "BOTH",
    narrative: [
      "Panic is the mark of an amateur, Operative. In Git, nothing is ever truly lost.",
      "A junior analyst just ran 'git reset --hard HEAD~1' and believes they've wiped out their 'advanced_model.py'. they are wrong.",
      "While the branch pointer has moved, the orphaned snapshot still lives in the object database. We use the 'Reflog' to find it.",
      "Your mission: Use 'git reflog' to find the hash of the commit titled 'feat: advanced model' and resurrect it.",
      "In the Dark Arts, we don't fear deletion. We master recovery.",
    ],
    setup: async (state) => {
      state.git.init();

      // Step 1: Baseline
      state.fs.writeFile("/baseline.py", "# v1.0");
      await state.git.add("baseline.py");
      await state.git.commit("feat: baseline", "Dr. Hassan");

      // Step 2: The "Lost" work
      state.fs.writeFile("/advanced_model.py", "model.train(deep=True)");
      await state.git.add("advanced_model.py");
      await await state.git.commit("feat: advanced model", "User");

      // Step 3: THE DESTRUCTION
      await state.git.reset("HEAD~1", "hard");
      // Verify file is gone from VFS
      if (state.fs.exists("advanced_model.py")) {
        state.fs.rm("advanced_model.py");
      }
    },
    goals: [
      {
        id: "resurrect_work",
        description: "Recover the lost 'advanced_model.py' using the reflog.",
        check: (state) => {
          return (
            state.fs.exists("advanced_model.py") &&
            state.git
              .getGraph()
              .commits.some((c) => c.message === "feat: advanced model")
          );
        },
      },
    ],
    hints: [
      "Run 'git reflog' to see the history of where your HEAD has been.",
      "Identify the hash before the 'reset' operation.",
      "Use 'git reset --hard <hash>' to force the branch back to that state.",
    ],
  },
  {
    id: 18,
    title: "The Parallel Universe",
    role: "BOTH",
    narrative: [
      "Context switching is the silent killer of focus, Operative.",
      "We need to spin up a major ML experiment, but our current 'master' branch must remain completely stable and untouched.",
      "In a massive monorepo, switching branches is too slow. Instead, we create 'Parallel Universes' using worktrees.",
      "Your mission: Create a parallel working tree at '../experiment-run' linked to a new branch 'experiment-branch'.",
      "Work on multiple problems simultaneously without ever leaving your current focus.",
    ],
    setup: async (state) => {
      state.git.init();
    },
    goals: [
      {
        id: "create_worktree",
        description: "Spin up a parallel workspace using 'git worktree add'.",
        check: (state) => state.git.getWorktrees().length >= 2,
      },
      {
        id: "list_worktrees",
        description: "Audit your active universes using 'git worktree list'.",
        check: (_state) => true,
      },
    ],
    hints: [
      "The command is 'git worktree add ../experiment-run experiment-branch'.",
      "Verify with 'git worktree list'.",
    ],
  },
  {
    id: 19,
    title: "The Cryptographic Seal",
    role: "BOTH",
    narrative: [
      "Trust but verify is for the average, Operative. At DataPulse, we only trust what is signed.",
      "A commit in our production registry without a signature is a technical liability. We must prove the identity of the engineer who authored the logic.",
      "Your mission: Configure your personal GPG key and use the '-S' flag to sign your next commit.",
      "Every bit of data and every line of SQL that touches production must be cryptographically anchored to your identity.",
      "Proof of authorship is the final seal of integrity.",
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile("/secure_pipeline.py", "# High-integrity logic");
    },
    goals: [
      {
        id: "config_key",
        description:
          "Configure your GPG signing key: 'git config --global user.signingkey 0x4A7F9C2D'.",
        check: (state) => !!state.git.getConfig("user.signingkey"),
      },
      {
        id: "signed_commit",
        description:
          "Sign your work using the '-S' flag: 'git commit -S -m \"...\"'.",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          return commits.length > 0 && !!commits[0].signature;
        },
      },
    ],
    hints: [
      "Use 'git config --global user.signingkey 0x4A7F9C2D' to set the seal.",
      "Run 'git add secure_pipeline.py', then 'git commit -S -m \"feat: signed pipeline\"'.",
      "If you forget the '-S', Dr. Hassan will reject the audit.",
    ],
  },
  {
    id: 20,
    title: "The Monorepo Architect",
    role: "BOTH",
    narrative: [
      "Today, we dispense with the training wheels, Operative. I am handing you the keys to the entire DataPulse Monorepo.",
      "This is the final trial. You must manage the complexity of a billion-line registry without breaking the heartbeat of the firm.",
      "Your multi-step mandate:",
      "1. Isolate the '/data/models' directory. We don't have time for the frontend noise.",
      "2. Spin up a parallel universe ('worktree') for a risky 'transformer-v4' experiment.",
      "3. Log your training lineage using 'mlflow' to anchor it to history.",
      "4. Sign your final production commit with your GPG seal.",
      "Prove to me that you are no longer a clerk, but a Legendary Staff Alchemist.",
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.mkdir("frontend");
      state.fs.mkdir("backend");
      state.fs.mkdir("data");
      state.fs.mkdir("data/models");
      state.fs.writeFile("/data/models/final_run.py", "model.train()");
      // Pre-set the key so they don't have to re-type it unless they want to
      state.git.setConfig("user.signingkey", "0x4A7F9C2D");
    },
    goals: [
      {
        id: "capstone_sparse",
        description:
          "Isolate the workspace: 'git sparse-checkout set data/models'.",
        check: (_state) => true, // Simulated signal
      },
      {
        id: "capstone_worktree",
        description:
          "Create a parallel universe: 'git worktree add ../exp-v4 experiment'.",
        check: (state) => state.git.getWorktrees().length >= 2,
      },
      {
        id: "capstone_mlflow",
        description: "Anchor the lineage: 'mlflow log --git-hash'.",
        check: (state) => state.fs.exists("mlruns/metadata.json"),
      },
      {
        id: "capstone_sign",
        description:
          "Seal the production registry: 'git commit -S -m \"feat: final ship\"'.",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          return commits.length > 0 && !!commits[0].signature;
        },
      },
    ],
    hints: [
      "Start with 'git sparse-checkout set data/models'.",
      "Next, 'git worktree add ../exp-v4 experiment'.",
      "Then, 'mlflow log --git-hash'.",
      "Finally, 'git add data/models/final_run.py' and 'git commit -S -m \"...\"'.",
    ],
  },
];
