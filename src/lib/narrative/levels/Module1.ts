import { LevelDefinition } from "../LevelManager";

/**
 * Module 1: The Safety Net (Foundation)
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Establishes the core mental model of Git as a chronological ledger.
 * Teaches absolute traceability, security hygiene (gitignore), and 
 * basic time travel. These are the mandatory 'Staff Alchemist' basics.
 */
export const MODULE_1_LEVELS: LevelDefinition[] = [
  {
    id: 1,
    title: "The Digital Ledger",
    role: "BOTH",
    narrative: [
      "Welcome to DataPulse Analytics. I am Dr. Hassan, and I do not tolerate digital amnesia.",
      "In this firm, an analyst's memory is their greatest liability. We trust only what is cryptographically recorded.",
      "Your first act as a Junior Operative is to establish your 'Digital Ledger' using `git init`. Without it, your logic is just hearsay.",
      "Initialize your registry, create a 'README.md', and use `git add` and `git commit` to anchor your thoughts into history.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: establish the starting buffer
      state.fs.writeFile(
        "/README.md",
        "# DataPulse Operative Log\nStatus: Initializing...",
      );
    },
    goals: [
      {
        id: "init",
        description: "Establish the core registry (git init).",
        // Logic: Verify that a 'master' branch entry exists in the ODB
        check: (state) => state.git.getBranches().size > 0,
      },
      {
        id: "commit",
        description:
          "Sign your first entry with Conventional Commits (feat: init).",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          if (commits.length === 0) return false;
          const latestMessage = commits[0].message.toLowerCase();
          // Pedagogy: Enforce professional 'Conventional Commit' standards from Day 1
          return ["feat:", "fix:", "docs:", "chore:"].some((type) =>
            latestMessage.startsWith(type),
          );
        },
      },
    ],
    hints: [
      "Dr. Hassan values structure. Use 'git init' to begin, then 'git add' and 'git commit' to record.",
      "Convention matters: Start your message with 'feat: ' or 'docs: ' to pass the audit.",
    ],
    helpMessage: "I see you require the full protocol. Listen closely:\n\n1. `git init`: This initializes a new Git repository. It creates the hidden infrastructure required to track your history.\n2. `git add README.md`: This moves your changes to the 'Staging Area'. Think of it as preparing a document for a permanent seal.\n3. `git commit -m \"feat: init\"`: This creates a permanent, signed snapshot of your staged work. The `-m` flag allows you to attach a message. We use 'feat:' or 'docs:' to follow professional standards.\n\nPrecision is our only defense against chaos. Do not fail me again.",
  },
  {
    id: 2,
    title: "The Integrity Shield",
    role: "BOTH",
    narrative: [
      "Record established. But visibility is not vulnerability.",
      "You nearly committed a 'raw_data.csv' containing production secrets. That is a Level 1 Data Crime.",
      "In high-stakes data science, we NEVER leak the lineage of our secrets. We must shield the ledger using a `.gitignore` file.",
      "Your mission: Create a `.gitignore` wall to ensure that raw data and environment variables never touch our shared history.",
      "Precision in concealment is just as important as precision in disclosure.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: inject dangerous files into the workspace
      state.fs.writeFile("/raw_data.csv", "id,secret_key\n1, DP-SECRET-99");
      state.fs.writeFile("/.env", "DB_PASSWORD=admin_pass");
      state.fs.writeFile("/analysis.py", "# Registry cleanup");
    },
    goals: [
      {
        id: "gitignore",
        description: "Architect the .gitignore shield for .csv and .env files.",
        check: (state) => {
          if (!state.fs.exists("/.gitignore")) return false;
          const content = state.fs.readFile("/.gitignore").toLowerCase();
          // Logic: Verify standard pattern coverage
          return content.includes(".csv") && content.includes(".env");
        },
      },
      {
        id: "clean_commit",
        description:
          "Version your analysis while keeping the secrets strictly local.",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          // Logic: Ensure the latest commit is 'Clean' of sensitive artifacts
          return commits.length > 0 && !commits[0].message.includes("crime");
        },
      },
    ],
    hints: [
      "The shield is a file named exactly '.gitignore'.",
      "Patterns like '*.csv' and '.env' will keep Dr. Hassan's audit clean.",
    ],
    helpMessage: "Security is the foundation of trust. Here is how you construct the shield:\n\n1. `touch .gitignore`: This creates the special file that Git looks for to know what to ignore.\n2. Add the patterns: Open the file and add `*.csv` and `.env` on separate lines. This tells Git to never look at these files.\n3. `git add .gitignore`: Register the shield itself in the ledger.\n4. `git commit -m \"chore: add gitignore\"`: Seal the security protocol.\n\nWithout a shield, your history is a liability.",
  },
  {
    id: 3,
    title: "The Archaeology of Logic",
    role: "BOTH",
    narrative: [
      "Accountability is the difference between a scientist and a storyteller.",
      "A client is disputing our Q3 revenue multipliers. They claim our current logic is 'inflated'.",
      "To defend the firm's reputation, you must perform digital archaeology using `git log` to find our 'Baseline' logic.",
      "Travel back to the origin using `git checkout`. Verify exactly what we promised before the updates changed the math.",
      "In this office, we don't guess what happened. We check the logs.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: Create a multi-commit history with changing logic
      state.git.init();
      state.fs.writeFile(
        "/revenue_model.py",
        "MULTIPLIER = 1.0 # Baseline logic",
      );
      await state.git.add("revenue_model.py");
      await state.git.commit("feat: establish baseline math", "Dr. Hassan");

      state.fs.writeFile(
        "/revenue_model.py",
        "MULTIPLIER = 1.4 # Q4 Aggressive Update",
      );
      await state.git.add("revenue_model.py");
      await state.git.commit(
        "feat: update multiplier for growth",
        "Dr. Hassan",
      );
    },
    goals: [
      {
        id: "view_history",
        description: "Audit the lineage logs (git log).",
        check: (state) => state.git.getGraph().commits.length >= 2,
      },
      {
        id: "travel_back",
        description: "Checkout the baseline hash to verify the original logic.",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          if (commits.length < 2) return false;
          // Logic: Verify that HEAD is currently detached at the root commit
          const firstHash = commits[commits.length - 1].hash;
          return state.git.getHead() === firstHash;
        },
      },
    ],
    hints: [
      "Run 'git log' to see the timeline. Copy the hash of the 'baseline math' commit.",
      "Use 'git checkout <hash>' to perform the jump.",
    ],
    helpMessage: "To travel through time, you must first map the past:\n\n1. `git log`: This displays the entire chronological ledger of this project. Each entry has a unique 'hash' (the long string of characters).\n2. Identify the hash: Look for the first commit, titled 'feat: establish baseline math'.\n3. `git checkout <hash>`: Replace `<hash>` with the actual characters you found. This moves the workstation's state back to that exact moment in history.\n\nNow, look at the files. The math cannot hide from a checkout.",
  },
  {
    id: 4,
    title: "The Surgical Recovery",
    role: "BOTH",
    narrative: [
      "Disaster is a data point, not an end point.",
      "An intern in the pipeline division just deleted our 'production_model.py'. The entire dashboard is dark.",
      "While others might panic, a DataPulse operative uses `git revert`. We keep history intact even when it hurts.",
      "Locate the commit where the model was lost and surgically undo it. Bring the production lines back online.",
      "We don't erase mistakes here. We record their correction.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: simulate a catastrophic error in history
      state.git.init();
      state.fs.writeFile("/production_model.py", "# High-fidelity v1.0");
      await state.git.add("production_model.py");
      await state.git.commit("feat: ship production model", "Staff Eng");

      state.fs.rm("/production_model.py");
      await state.git.add("production_model.py");
      await state.git.commit("fix: minor cleanup (OOPS)", "Accidental Intern");
    },
    goals: [
      {
        id: "revert",
        description: "Undo the accidental deletion with a revert commit.",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          // Logic: File must exist AND history must show an explicit revert action
          return (
            state.fs.exists("/production_model.py") &&
            commits.some((c) => c.message.toLowerCase().includes("revert"))
          );
        },
      },
    ],
    hints: [
      "Find the hash of the 'OOPS' commit in the logs.",
      "Run 'git revert <hash>' to create the recovery commit.",
    ],
    helpMessage: "Revert is the surgical tool for error correction. It does not delete history; it creates a new entry that cancels out a previous mistake:\n\n1. `git log`: Find the hash of the commit titled 'fix: minor cleanup (OOPS)'. That is the point of failure.\n2. `git revert <hash>`: This command calculates the exact inverse of that commit's changes and applies them as a new snapshot.\n\nThis maintains a perfect audit trail of both the error and the correction. Integrity is preserved.",
  },
];
