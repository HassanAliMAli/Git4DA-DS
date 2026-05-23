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
  {
    id: 10,
    title: "The Jupytext Bridge",
    role: "DATA_ANALYST",
    narrative: [
      "Notebooks are for playgrounds, Analyst. Scripts are for production.",
      "A raw '.ipynb' file is a mess of JSON metadata that is impossible to code-review. We use 'Jupytext' to mirror our logic into clean '.py' files.",
      "Your mission: You have an 'exploration.ipynb'. Use the 'jupytext --sync' command to generate its Python counterpart.",
      "Version only the '.py' script. Leave the bloated notebook in the local cache. Precision in reviewability is your new metric.",
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile("/exploration.ipynb", '{"cells": [{"cell_type": "code", "source": ["print(\"hello\")"]}]}');
    },
    goals: [
      {
        id: "sync_notebook",
        description: "Synchronize the notebook using 'jupytext --sync exploration.ipynb'.",
        check: (state) => state.fs.exists("exploration.py"),
      },
      {
        id: "ignore_notebook",
        description: "Shield the raw .ipynb from the registry via .gitignore.",
        check: (state) => {
          if (!state.fs.exists(".gitignore")) return false;
          return state.fs.readFile(".gitignore").includes(".ipynb");
        },
      },
      {
        id: "commit_script",
        description: "Commit the clean .py script to history.",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          return commits.length > 0 && state.fs.exists("exploration.py");
        },
      },
    ],
    hints: [
      "Run 'jupytext --sync exploration.ipynb' to generate the script.",
      "Add '.ipynb' to your .gitignore before you commit.",
    ],
  },
  {
    id: 10,
    title: "The Experiment Hash",
    role: "DATA_SCIENTIST",
    narrative: [
      "An experiment without a version is just a rumor, Scientist.",
      "At DataPulse, every model we train must be cryptographically linked to the exact code version that produced it.",
      "Your mission: Train a mock model and use 'mlflow log' to anchor the current Git HEAD hash into your experiment metadata.",
      "This ensures that 6 months from now, we can precisely reconstruct your 'Alchemy' from the ledger.",
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile("/train.py", "model.train()");
      await state.git.add("train.py");
      await state.git.commit("feat: initial training logic", "User");
    },
    goals: [
      {
        id: "log_experiment",
        description: "Link your experiment using 'mlflow log --git-hash'.",
        check: (state) => state.fs.exists("mlruns/metadata.json") && state.fs.readFile("mlruns/metadata.json").includes(state.git.getCurrentCommit()?.substring(0, 7) || ""),
      },
    ],
    hints: [
      "The custom command is 'mlflow log --git-hash'. It will read your current commit and record it.",
    ],
  },
  {
    id: 11,
    title: "The Quality Gate",
    role: "DATA_ANALYST",
    narrative: [
      "Logic is 50% of the job, Analyst. Presentation is the other 50%.",
      "I found a messy SQL file in your directory. Inconsistent casing and sloppy whitespace are 'Technical Debt' that I will not sign.",
      "We use 'SQLFluff' to enforce a world-class standard. Your mission: Lint your 'revenue.sql'. If it fails, use 'sqlfluff fix' to bring it to PhD-level quality.",
      "A professional registry only holds code that is as beautiful as it is correct.",
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile("/revenue.sql", "select sum(total)  from sales;");
    },
    goals: [
      {
        id: "lint_sql",
        description: "Run 'sqlfluff lint revenue.sql' to detect violations.",
        check: (state) => true, // We allow the user to see the errors
      },
      {
        id: "fix_sql",
        description: "Standardize the SQL using 'sqlfluff fix revenue.sql'.",
        check: (state) => {
          if (!state.fs.exists("revenue.sql")) return false;
          const content = state.fs.readFile("revenue.sql");
          return content.includes("SELECT") && !content.includes("  ");
        },
      },
      {
        id: "commit_clean",
        description: "Version the standardized SQL.",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          return commits.length > 0 && !state.fs.readFile("revenue.sql").includes("select");
        },
      },
    ],
    hints: [
      "Run 'sqlfluff lint revenue.sql' first to see Dr. Hassan's complaints.",
      "Use 'sqlfluff fix revenue.sql' to automatically reformat the logic.",
    ],
  },
  {
    id: 11,
    title: "The Feature Registry",
    role: "DATA_SCIENTIST",
    narrative: [
      "Hardcoded features in your training scripts are a 'Legacy Trap', Scientist.",
      "If we want to scale, our features must be modular and registered in a 'Central Vault' (Feast).",
      "Your mission: Extract your feature definitions from 'train.py' into a dedicated 'features.py' and apply them to our registry.",
      "Standardizing our inputs is the only way to prevent 'Data Drift' in production.",
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile("/train.py", "features = ['age', 'income', 'geo']\nmodel.fit(features)");
    },
    goals: [
      {
        id: "extract_features",
        description: "Create 'features.py' with modular definitions.",
        check: (state) => state.fs.exists("features.py"),
      },
      {
        id: "apply_registry",
        description: "Register the features using 'feast apply'.",
        check: (state) => state.fs.exists("feature_store.yaml"),
      },
      {
        id: "commit_registry",
        description: "Version the feature definitions and registry config.",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          return commits.length > 0 && state.fs.exists("feature_store.yaml");
        },
      },
    ],
    hints: [
      "Use 'touch features.py' to extract the logic.",
      "Run the custom 'feast apply' command to generate the simulation config.",
    ],
  },
  {
    id: 12,
    title: "Continuous Integrity",
    role: "DATA_ANALYST",
    narrative: [
      "Efficiency is an engineering virtue, Analyst. Testing everything on every commit is a waste of the firm's compute resources.",
      "We use 'Slim CI'—a state-aware pipeline that identifies exactly which SQL models have changed and tests only those.",
      "Your mission: You've updated 'models/stg_revenue.sql'. Use the 'dbt clone' command with the '--state' flag to simulate a Slim CI run.",
      "Precision in automation allows us to ship faster without sacrificing the ledger's integrity.",
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.mkdir("models");
      state.fs.writeFile("/models/stg_revenue.sql", "SELECT * FROM raw_rev;");
      await state.git.add("models/stg_revenue.sql");
      await state.git.commit("feat: initial revenue model", "User");
    },
    goals: [
      {
        id: "trigger_slim_ci",
        description: "Simulate a Slim CI run using 'dbt clone --state prod'.",
        check: (state) => true, // We allow the command trigger to pass
      },
      {
        id: "push_automation",
        description: "Push your optimized pipeline changes to the central registry.",
        check: (state) => {
          const remotes = state.git.getRemoteBranches("origin");
          return remotes.has("master");
        },
      },
    ],
    hints: [
      "Run 'dbt clone --state prod' to see the compute optimization in action.",
      "Don't forget to 'git push origin master' to finalize the mission.",
    ],
  },
  {
    id: 12,
    title: "The Training Trigger",
    role: "DATA_SCIENTIST",
    narrative: [
      "Manual work is the enemy of scale, Scientist. If you have to click a button to train a model, you have already lost.",
      "At DataPulse, our code *is* the trigger. We use GitHub Actions to automate training the moment your logic hits the registry.",
      "Your mission: You have a 'train.py'. Simulate an automated workflow trigger by running the 'workflow' command.",
      "Automation ensures that our models are always in sync with our formulas. Move from artisan to industrialist.",
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile("/train.py", "model.fit()");
      await state.git.add("train.py");
      await state.git.commit("feat: production training script", "User");
    },
    goals: [
      {
        id: "trigger_workflow",
        description: "Simulate an automated training run using 'workflow trigger train'.",
        check: (state) => true,
      },
      {
        id: "push_trigger",
        description: "Push your production logic to activate the live central pipeline.",
        check: (state) => {
          const remotes = state.git.getRemoteBranches("origin");
          return remotes.has("master");
        },
      },
    ],
    hints: [
      "Run 'workflow trigger train' to initiate the simulated GPU run.",
      "Push your work with 'git push origin master' to complete the loop.",
    ],
  },
];
