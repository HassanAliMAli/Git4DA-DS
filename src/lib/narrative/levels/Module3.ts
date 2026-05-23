import { LevelDefinition } from "../LevelManager";

export const MODULE_3_LEVELS: LevelDefinition[] = [
  {
    id: 9,
    title: "The Analytical Architect",
    role: "DATA_ANALYST",
    narrative: [
      "Promotion brings responsibility, Analyst. Ad-hoc SQL scripts are the mark of an amateur.",
      "At DataPulse, we architect our logic using 'dbt' patterns. We treat data transformations like software engineering.",
      "Your next mission: Transition our 'Staging' logic into a modular structure. Create a 'models/' directory and initialize your first production-grade SQL model.",
      "We don't just 'run queries'. We build pipelines that survive the test of time. Precision in structure is your new mandate.",
    ],
    setup: async (state) => {
      state.git.init();
    },
    goals: [
      {
        id: "mkdir_models",
        description: "Architect the 'models/' directory structure.",
        check: (state) =>
          state.fs.exists("models") && state.fs.isDirectory("models"),
      },
      {
        id: "create_model",
        description:
          "Initialize 'models/stg_revenue.sql' with production logic.",
        check: (state) => state.fs.exists("models/stg_revenue.sql"),
      },
      {
        id: "commit_model",
        description:
          "Version your architectural changes (feat: add stg_revenue).",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          return (
            commits.length > 0 &&
            commits[0].message.toLowerCase().startsWith("feat:")
          );
        },
      },
    ],
    hints: [
      "Use 'mkdir models' and 'touch models/stg_revenue.sql'.",
      "Git add and commit your structure to finalize the architecture mission.",
    ],
  },
  {
    id: 9,
    title: "The Alchemist's Pointer",
    role: "DATA_SCIENTIST",
    narrative: [
      "Data is heavy. Git is light. Mixing them is a 'Data Crime' that slows the firm's heartbeat.",
      "A professional alchemist versions the 'Formula' (the code), while the 'Lead' (the binary weights) stays out of the ledger.",
      "We use DVC (Data Version Control) to track our 1GB model weights via tiny, immutable 'Pointers'.",
      "Your mission: You have a 'model_weights.pkl'. Shield it with .gitignore and create its '.dvc' pointer file.",
      "Version the pointer, not the weight. Keep our registry fast and our experiments reproducible.",
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile("/model_weights.pkl", "[BINARY_DATA_1GB]");
    },
    goals: [
      {
        id: "create_pointer",
        description: "Establish the DVC pointer 'model_weights.pkl.dvc'.",
        check: (state) => state.fs.exists("model_weights.pkl.dvc"),
      },
      {
        id: "ignore_weights",
        description: "Enforce the binary shield in your .gitignore.",
        check: (state) => {
          if (!state.fs.exists(".gitignore")) return false;
          return state.fs.readFile(".gitignore").includes(".pkl");
        },
      },
      {
        id: "commit_pointer",
        description:
          "Version the pointer and the shield, leaving the binary local.",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          return commits.length > 0 && state.fs.exists("model_weights.pkl.dvc");
        },
      },
    ],
    hints: [
      "Create the pointer file manually with 'echo \"dvc://s3-v1.2\" > model_weights.pkl.dvc'.",
      "Ensure .pkl is added to your .gitignore before the final commit.",
    ],
  },
];
