import { LevelDefinition } from "../LevelManager";

export const MODULE_1_LEVELS: LevelDefinition[] = [
  {
    id: 1,
    title: "The Digital Ledger",
    role: "BOTH",
    narrative: [
      "Welcome to DataPulse Analytics. I am Dr. Hassan, and I do not tolerate digital amnesia.",
      "In this firm, an analyst's memory is their greatest liability. We trust only what is cryptographically recorded.",
      "Your first act as a Junior Operative is to establish your 'Digital Ledger'. Without it, your logic is just hearsay.",
      "Initialize your registry. Create a 'README.md' and commit it. Prove to me you can anchor your thoughts into history.",
    ],
    setup: async (state) => {
      state.fs.writeFile(
        "/README.md",
        "# DataPulse Operative Log\nStatus: Initializing...",
      );
    },
    goals: [
      {
        id: "init",
        description: "Establish the core registry (git init).",
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
          return ["feat:", "fix:", "docs:", "chore:"].some((type) =>
            latestMessage.startsWith(type),
          );
        },
      },
    ],
    hints: [
      "Dr. Hassan value structure. Use 'git init' to begin, then 'git add' and 'git commit' to record.",
      "Convention matters: Start your message with 'feat: ' or 'docs: ' to pass the audit.",
    ],
  },
  {
    id: 2,
    title: "The Integrity Shield",
    role: "BOTH",
    narrative: [
      "Record established. But visibility is not vulnerability.",
      "You nearly committed a 'raw_data.csv' containing production secrets. That is a Level 1 Data Crime.",
      "In high-stakes data science, we NEVER leak the lineage of our secrets. We must shield the ledger.",
      "Your mission: Create a '.gitignore' wall. Ensure that raw data and environment variables never touch our shared history.",
      "Precision in concealment is just as important as precision in disclosure.",
    ],
    setup: async (state) => {
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
          return content.includes(".csv") && content.includes(".env");
        },
      },
      {
        id: "clean_commit",
        description:
          "Version your analysis while keeping the secrets strictly local.",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          return commits.length > 0 && !commits[0].message.includes("crime");
        },
      },
    ],
    hints: [
      "The shield is a file named exactly '.gitignore'.",
      "Patterns like '*.csv' and '.env' will keep Dr. Hassan's audit clean.",
    ],
  },
  {
    id: 3,
    title: "The Archaeology of Logic",
    role: "BOTH",
    narrative: [
      "Accountability is the difference between a scientist and a storyteller.",
      "A client is disputing our Q3 revenue multipliers. They claim our current logic is 'inflated'.",
      "To defend the firm's reputation, you must perform digital archaeology. Find our 'Baseline' logic from the very first commit.",
      "Travel back to the origin of this project. Verify exactly what we promised before the updates changed the math.",
      "In this office, we don't guess what happened. We check the logs.",
    ],
    setup: async (state) => {
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
          const firstHash = commits[commits.length - 1].hash;
          return state.git.getHead() === firstHash;
        },
      },
    ],
    hints: [
      "Run 'git log' to see the timeline. Copy the hash of the 'baseline math' commit.",
      "Use 'git checkout <hash>' to perform the jump.",
    ],
  },
  {
    id: 4,
    title: "The Surgical Recovery",
    role: "BOTH",
    narrative: [
      "Disaster is a data point, not an end point.",
      "An intern in the pipeline division just deleted our 'production_model.py'. The entire dashboard is dark.",
      "While others might panic and 're-write', a DataPulse operative uses 'revert'. We keep history intact even when it hurts.",
      "Locate the commit where the model was lost and surgically undo it. Bring the production lines back online.",
      "We don't erase mistakes here. We record their correction.",
    ],
    setup: async (state) => {
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
  },
];
