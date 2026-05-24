import { LevelDefinition } from "../LevelManager";

/**
 * Module 3B: Data Scientist "Production Alchemist" Track
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Focuses on large-binary versioning (DVC), experiment tracking (MLflow), 
 * and feature store patterns (Feast). Addresses the unique 'Data Crimes' 
 * associated with heavy ML artifacts.
 */
export const MODULE_3B_LEVELS: LevelDefinition[] = [
  {
    id: 9,
    title: "The Alchemist's Pointer",
    role: "DATA_SCIENTIST",
    narrative: [
      "Data is heavy. Git is light. Mixing them is a 'Data Crime' that slows the firm's heartbeat.",
      "A professional alchemist versions the 'Formula' (the code), while the 'Lead' (the binary weights) stays out of the ledger.",
      "We use DVC (Data Version Control) to track our 1GB model weights via tiny, immutable 'Pointers'.",
      "Your mission: You have a 'model_weights.pkl'. Shield it with `.gitignore` and create its `.dvc` pointer file using the `echo` command.",
      "Version the pointer, not the weight. Keep our registry fast and our experiments reproducible.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: establish the 'Heavy' binary file
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
          const content = state.fs.readFile(".gitignore").toLowerCase();
          // Logic: Verify that the binary artifact is excluded from the DAG
          return content.includes(".pkl");
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
    helpMessage: "Mixing data with code is a fundamental error. Here is the correct alchemical process:\n\n1. `touch .gitignore`: Create the security shield.\n2. Add `*.pkl` to `.gitignore`: This ensures the heavy binary weights never enter the Git registry.\n3. `echo \"dvc://s3-v1.2\" > model_weights.pkl.dvc`: This creates a lightweight 'Pointer' file that represents the data without containing it.\n4. `git add .gitignore model_weights.pkl.dvc`: Register the shield and the pointer.\n5. `git commit -m \"feat: add dvc pointer for model weights\"`: Record the versioned formula.\n\nNow our history is fast and our data is tracked externally. Efficiency is verified.",
  },
  {
    id: 10,
    title: "The Experiment Hash",
    role: "DATA_SCIENTIST",
    narrative: [
      "An experiment without a version is just a rumor, Scientist.",
      "At DataPulse, every model we train must be cryptographically linked to the exact code version that produced it.",
      "Your mission: Train a mock model and use `mlflow log` to anchor the current Git HEAD hash into your experiment metadata.",
      "This ensures that 6 months from now, we can precisely reconstruct your 'Alchemy' from the ledger.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: training script ready for logging
      state.git.init();
      state.fs.writeFile("/train.py", "model.train()");
      await state.git.add("train.py");
      await state.git.commit("feat: initial training logic", "User");
    },
    goals: [
      {
        id: "log_experiment",
        description: "Link your experiment using 'mlflow log --git-hash'.",
        check: (state) => {
          if (!state.fs.exists("mlruns/metadata.json")) return false;
          const content = state.fs.readFile("mlruns/metadata.json");
          const headHash = state.git.getCurrentCommit()?.substring(0, 7) || "";
          // Logic: Verify that the MLflow log contains the correct Git commit hash
          return content.includes(headHash);
        },
      },
    ],
    hints: [
      "The custom command is 'mlflow log --git-hash'. It will read your current commit and record it.",
    ],
    helpMessage: "Traceability is the difference between a guess and a result:\n\n1. `mlflow log --git-hash`: This custom command audits your current Git HEAD and records its unique cryptographic hash into the MLflow metadata.\n\nBy linking the experiment to the hash, we ensure total reproducibility. Your alchemy is now anchored in history.",
  },
  {
    id: 11,
    title: "The Feature Registry",
    role: "DATA_SCIENTIST",
    narrative: [
      "Hardcoded features in your training scripts are a 'Legacy Trap', Scientist.",
      "If we want to scale, our features must be modular and registered in a 'Central Vault' using `feast apply`.",
      "Your mission: Extract your feature definitions from 'train.py' into a dedicated 'features.py' and apply them to our registry.",
      "Standardizing our inputs is the only way to prevent 'Data Drift' in production.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: script with hardcoded features
      state.git.init();
      state.fs.writeFile(
        "/train.py",
        "features = ['age', 'income', 'geo']\nmodel.fit(features)"
      );
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
          return (
            commits.length > 0 && state.fs.exists("feature_store.yaml")
          );
        },
      },
    ],
    hints: [
      "Use 'touch features.py' to extract the logic.",
      "Run the custom 'feast apply' command to generate the simulation config.",
    ],
    helpMessage: "Modularizing features prevents data drift and enables reuse:\n\n1. `touch features.py`: Create the dedicated definition file.\n2. `feast apply`: This command registers your local definitions with the firm's central feature vault (simulated by generating `feature_store.yaml`).\n3. `git add features.py feature_store.yaml`: Stage the modular definitions.\n4. `git commit -m \"feat: register production features\"`: Record the standardization.\n\nYou have moved from hardcoded traps to industrial-grade feature engineering.",
  },
  {
    id: 12,
    title: "The Training Trigger",
    role: "DATA_SCIENTIST",
    narrative: [
      "Manual work is the enemy of scale, Scientist. If you have to click a button to train a model, you have already lost.",
      "At DataPulse, our code *is* the trigger. We use GitHub Actions and `workflow trigger` to automate training.",
      "Your mission: You have a 'train.py'. Simulate an automated workflow trigger by running the `workflow` command.",
      "Automation ensures that our models are always in sync with our formulas. Move from artisan to industrialist.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: final production script
      state.git.init();
      state.fs.writeFile("/train.py", "model.fit()");
      await state.git.add("train.py");
      await state.git.commit("feat: production training script", "User");
    },
    goals: [
      {
        id: "trigger_workflow",
        description:
          "Simulate an automated training run using 'workflow trigger train'.",
        check: (_state) => true, // Validated via the command output stream
      },
      {
        id: "push_trigger",
        description:
          "Push your production logic to activate the live central pipeline.",
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
    helpMessage: "Automation is the ultimate form of discipline:\n\n1. `workflow trigger train`: This custom command simulates a GitHub Action that initiates a GPU-backed training run using your latest code.\n2. `git push origin master`: Publish your code to the central registry to trigger the real production pipeline.\n\nYour artisan days are over. You are now an industrialist of data.",
  },
];
