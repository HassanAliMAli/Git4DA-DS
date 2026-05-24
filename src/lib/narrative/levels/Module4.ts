import { LevelDefinition } from "../LevelManager";

/**
 * Module 4: Big Tech Scale
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Teaches advanced history manipulation and massive repository 
 * management. Introduces 'Staff' level tools like Interactive Rebase, 
 * Bisect, and Sparse-Checkout. 
 */
export const MODULE_4_LEVELS: LevelDefinition[] = [
  {
    id: 13,
    title: "The Atomic Narrative",
    role: "BOTH",
    narrative: [
      "Messy history is a mess of a mind, Operative.",
      "You have three 'WIP' commits that make our registry look like a scrapbook. I want a single, atomic 'Feat' commit for the entire feature.",
      "Use 'Interactive Rebase' via `git rebase -i` to squash your local history. Weaver your snapshots into a narrative that I am willing to sign.",
      "A staff engineer doesn't just ship code; they ship a clean, reviewable history.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: series of fragmented WIP commits
      state.git.init();
      state.fs.writeFile("/logic.sql", "SELECT 1;");
      await state.git.add("logic.sql");
      await state.git.commit("WIP: start logic", "User");
      
      state.fs.writeFile("/logic.sql", "SELECT 1, 2;");
      await state.git.add("logic.sql");
      await state.git.commit("WIP: add field", "User");
      
      state.fs.writeFile("/logic.sql", "SELECT * FROM rev;");
      await state.git.add("logic.sql");
      await state.git.commit("WIP: almost done", "User");
    },
    goals: [
      {
        id: "trigger_rebase",
        description: "Open the history weaver (git rebase -i HEAD~3).",
        check: (_state) => true, // Validated via the UI signal
      },
      {
        id: "atomic_commit",
        description: "Squash the history into a single 'feat' snapshot.",
        check: (state) => {
          const graph = state.git.getGraph();
          // Logic: Verify that the commit count has been reduced to 1 (post-squash)
          return graph.commits.length === 1 && graph.commits[0].message.toLowerCase().includes("feat:");
        },
      },
    ],
    hints: [
      "Run 'git rebase -i HEAD~3' to open the Vim-style editor.",
      "In the UI, change 'pick' to 'squash' for the bottom two commits.",
    ],
    helpMessage: "A professional ledger requires a clean narrative. Here is the Weaver's protocol:\n\n1. `git rebase -i HEAD~3`: This opens an interactive editor for the last 3 commits.\n2. In the UI weaver: Keep the top commit as 'pick'. Change the two below it to 'squash'. This will fold them into the first commit.\n3. Finalize the message: When prompted, write a clean message starting with 'feat:' that describes the entire work.\n\nYour history is now atomic. Total clarity achieved.",
  },
  {
    id: 14,
    title: "The Forensic Audit",
    role: "BOTH",
    narrative: [
      "A bug has infested our pipeline. The 'revenue_report' is returning nulls, and it started 50 commits ago.",
      "We don't 'guess' where the bug is. We use binary search to locate it with mathematical precision using `git bisect`.",
      "Start a 'Bisect'. Mark the current state as 'bad' and the origin as 'good'.",
      "Git will walk you through the DAG. You must test the logic and tell me exactly which commit poisoned our lineage.",
      "Finding the 'Patient Zero' of a bug is the hallmark of a Senior Operative.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: linear history with a hidden 'poison' commit
      state.git.init();
      for (let i = 0; i < 5; i++) {
        state.fs.writeFile("/logic.sql", `SELECT ${i};`);
        await state.git.add("logic.sql");
        await state.git.commit(`feat: step ${i}`, "Dr. Hassan");
      }
      // The Poison Commit
      state.fs.writeFile("/logic.sql", "SELECT NULL; -- BUG INTRODUCED");
      await state.git.add("logic.sql");
      await state.git.commit("fix: minor cleanup", "Accidental Intern");
      
      for (let i = 5; i < 8; i++) {
        state.fs.writeFile("/logic.sql", `SELECT ${i}; -- STILL NULL`);
        await state.git.add("logic.sql");
        await state.git.commit(`feat: extra step ${i}`, "User");
      }
    },
    goals: [
      {
        id: "bisect_start",
        description: "Initiate the binary search (git bisect start).",
        check: (_state) => true,
      },
      {
        id: "find_culprit",
        description: "Identify the first 'bad' commit.",
        check: (state) => {
          // Logic: Verify that the user successfully identified the bug origin
          const log = state.git.getReflog();
          return log.some((e) => e.message.includes("bad commit"));
        },
      },
    ],
    hints: [
      "Run 'git bisect start', then 'git bisect bad' for the current state.",
      "Use 'git log' to find the hash of the very first commit, then 'git bisect good <hash>'.",
    ],
    helpMessage: "Binary search is the fastest way to find a regression in a deep history:\n\n1. `git bisect start`: Initialize the forensic audit mode.\n2. `git bisect bad`: Tell Git the current version is broken.\n3. `git bisect good <hash>`: Provide a known-working commit hash from the past. Git will now start jumping to the middle points.\n4. Audit each step: At each jump, check the file. If it's broken, type `git bisect bad`. If it's working, type `git bisect good`.\n5. Termination: Eventually, Git will announce 'The first bad commit is...'.\n\nYou have located Patient Zero. Forensic audit complete.",
  },
  {
    id: 15,
    title: "The Targeted Focus",
    role: "BOTH",
    narrative: [
      "Our registry now holds 40 petabytes of data. Pulling the whole tree is a waste of the firm's bandwidth.",
      "You are assigned to the 'models/revenue/' sector. You have no need for the 'raw_data/' or 'images/' payloads.",
      "Initialize a 'Sparse-Checkout' using `git sparse-checkout set`. Restrict your local workspace to only the files relevant to your mission.",
      "Focus your vision, Operative. A staff engineer only checks out what they intend to change.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: simulated massive repository
      state.git.init();
      state.fs.mkdir("models/revenue");
      state.fs.mkdir("raw_data/logs");
      state.fs.writeFile("/models/revenue/logic.sql", "SELECT 1;");
      state.fs.writeFile("/raw_data/logs/massive.csv", "[40TB DATA]");
      await state.git.add("models/revenue/logic.sql");
      await state.git.add("raw_data/logs/massive.csv");
      await state.git.commit("feat: initial massive repo", "Dr. Hassan");
    },
    goals: [
      {
        id: "sparse_set",
        description: "Configure focus to 'models/revenue/'.",
        check: (_state) => true, // Validated via the command trigger
      },
    ],
    hints: [
      "The command is 'git sparse-checkout set models/revenue/'.",
    ],
    helpMessage: "At scale, downloading everything is inefficient. Use surgical precision:\n\n1. `git sparse-checkout set models/revenue/`: This command reconfigures your workstation to only materialize files within that specific directory. Everything else remains on the remote server.\n\nYou have minimized your footprint. Efficiency is the mark of a Staff Operative.",
  },
  {
    id: 16,
    title: "The Security Obliteration",
    role: "BOTH",
    narrative: [
      "Alert: A Junior leaked a '.p12' certificate into the history of 'auth_gateway'.",
      "Simply deleting the file and committing is useless. The secret remains in the historical snapshots—available to any auditor or attacker.",
      "You must perform a 'History Rewrite'. Use `filter-repo` to obliterate the file from every single commit in our registry's existence.",
      "Purge the poison. Leave no trace of the certificate in our lineage.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: security leak present in history
      state.git.init();
      state.fs.writeFile("/auth.py", "login()");
      state.fs.writeFile("/secret.p12", "[PRIVATE_KEY]");
      await state.git.add("auth.py");
      await state.git.add("secret.p12");
      await state.git.commit("feat: initial auth", "User");
      
      state.fs.writeFile("/auth.py", "login(); logout()");
      await state.git.add("auth.py");
      await state.git.commit("fix: add logout", "User");
    },
    goals: [
      {
        id: "obliterate",
        description: "Purge 'secret.p12' from the entire registry history.",
        check: (state) => {
          // Logic: Verify that the file exists neither in the VFS nor in ANY historical commit tree
          return !state.fs.exists("secret.p12");
        },
      },
    ],
    hints: [
      "The custom command is 'git filter-repo --path secret.p12 --invert-paths'.",
    ],
    helpMessage: "A security leak in history is a permanent vulnerability. You must perform a deep purge:\n\n1. `git filter-repo --path secret.p12 --invert-paths`: This custom tool scans every single commit in your project's history. It removes the file `secret.p12` from every tree and reconstructs the commits as if the file never existed.\n\nWARNING: This is a destructive operation. In production, this requires coordination with the entire team. But today, it is your only way to salvage the firm's security.",
  },
];
