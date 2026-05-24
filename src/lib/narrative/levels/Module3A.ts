import { LevelDefinition } from "../LevelManager";

/**
 * Module 3A: Data Analyst "Insights Architect" Track
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Focuses on professional SQL engineering and notebook-to-script 
 * synchronization workflows (dbt, Jupytext). Introduces the concept 
 * of 'Analytical Engineering' rigor.
 */
export const MODULE_3A_LEVELS: LevelDefinition[] = [
  {
    id: 9,
    title: "The Analytical Architect",
    role: "DATA_ANALYST",
    narrative: [
      "Promotion brings responsibility, Analyst. Ad-hoc SQL scripts are the mark of an amateur.",
      "At DataPulse, we architect our logic using 'dbt' patterns. We treat data transformations like software engineering.",
      "Your next mission: Transition our 'Staging' logic into a modular structure using `mkdir`. Initialize your first production-grade SQL model with `touch`.",
      "We don't just 'run queries'. We build pipelines that survive the test of time. Precision in structure is your new mandate.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: fresh registry for modular architecting
      state.git.init();
    },
    goals: [
      {
        id: "mkdir_models",
        description: "Architect the 'models/' directory structure.",
        check: (state) => state.fs.exists("models") && state.fs.isDirectory("models"),
      },
      {
        id: "create_model",
        description: "Initialize 'models/stg_revenue.sql' with production logic.",
        check: (state) => state.fs.exists("models/stg_revenue.sql"),
      },
      {
        id: "commit_model",
        description: "Version your architectural changes (feat: add stg_revenue).",
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
    helpMessage: "Architectural integrity requires a defined structure:\n\n1. `mkdir models`: This creates the standard directory for dbt-style data models.\n2. `touch models/stg_revenue.sql`: Create the staging model file within that directory.\n3. `git add models/`: Stage the entire new directory structure.\n4. `git commit -m \"feat: add stg_revenue architecture\"`: Record the structural expansion of the registry.\n\nWithout structure, your data is just noise.",
  },
  {
    id: 10,
    title: "The Jupytext Bridge",
    role: "DATA_ANALYST",
    narrative: [
      "Notebooks are for playgrounds, Analyst. Scripts are for production.",
      "A raw '.ipynb' file is a mess of JSON metadata that is impossible to code-review. We use `jupytext` to mirror our logic into clean '.py' files.",
      "Your mission: You have an 'exploration.ipynb'. Use the `jupytext --sync` command to generate its Python counterpart.",
      "Version only the '.py' script. Leave the bloated notebook in the local cache. Precision in reviewability is your new metric.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: established notebook pending sync
      state.git.init();
      state.fs.writeFile(
        "/exploration.ipynb",
        '{"cells": [{"cell_type": "code", "source": ["print(\"hello\")"]}]}'
      );
    },
    goals: [
      {
        id: "sync_notebook",
        description:
          "Synchronize the notebook using 'jupytext --sync exploration.ipynb'.",
        check: (state) => state.fs.exists("exploration.py"),
      },
      {
        id: "ignore_notebook",
        description: "Shield the raw .ipynb from the registry via .gitignore.",
        check: (state) => {
          if (!state.fs.exists(".gitignore")) return false;
          const content = state.fs.readFile(".gitignore").toLowerCase();
          // Logic: Verify that the binary notebook is excluded from the DAG
          return content.includes(".ipynb");
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
    helpMessage: "Jupytext bridges the gap between interactive exploration and professional review:\n\n1. `jupytext --sync exploration.ipynb`: This command generates a clean Python script (`.py`) that mirrors your notebook logic.\n2. Create/Update `.gitignore`: Add `.ipynb` to the file to ensure the binary notebook blob never pollutes the ledger.\n3. `git add exploration.py .gitignore`: Stage the readable script and the security protocol.\n4. `git commit -m \"feat: sync exploration script\"`: Record the reviewable logic.\n\nOnly the script matters to the audit.",
  },
  {
    id: 11,
    title: "The Quality Gate",
    role: "DATA_ANALYST",
    narrative: [
      "Logic is 50% of the job, Analyst. Presentation is the other 50%.",
      "I found a messy SQL file in your directory. Inconsistent casing and sloppy whitespace are 'Technical Debt'.",
      "We use `sqlfluff` to enforce a world-class standard. Your mission: Lint your 'revenue.sql'. If it fails, use `sqlfluff fix` to bring it to PhD-quality.",
      "A professional registry only holds code that is as beautiful as it is correct.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: sloppy SQL buffer
      state.git.init();
      state.fs.writeFile("/revenue.sql", "select sum(total)  from sales;");
    },
    goals: [
      {
        id: "lint_sql",
        description: "Run 'sqlfluff lint revenue.sql' to detect violations.",
        check: (_state) => true, // We allow the user to observe the failure report
      },
      {
        id: "fix_sql",
        description: "Standardize the SQL using 'sqlfluff fix revenue.sql'.",
        check: (state) => {
          if (!state.fs.exists("revenue.sql")) return false;
          const content = state.fs.readFile("revenue.sql");
          // Logic: Verify standard keyword casing and whitespace reduction
          return content.includes("SELECT") && !content.includes("  ");
        },
      },
      {
        id: "commit_clean",
        description: "Version the standardized SQL.",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          return (
            commits.length > 0 &&
            !state.fs.readFile("revenue.sql").includes("select")
          );
        },
      },
    ],
    hints: [
      "Run 'sqlfluff lint revenue.sql' first to see Dr. Hassan's complaints.",
      "Use 'sqlfluff fix revenue.sql' to automatically reformat the logic.",
    ],
    helpMessage: "Standardization is not optional in a high-fidelity environment:\n\n1. `sqlfluff lint revenue.sql`: This command scans your file against our firm's style guide and reports every violation.\n2. `sqlfluff fix revenue.sql`: This command automatically rewrites your SQL to comply with the rules (fixing casing, indentation, and spacing).\n3. `git add revenue.sql` and `git commit`: Once the logic is beautiful, record it in the ledger.\n\nSloppy code is a sign of a sloppy mind.",
  },
  {
    id: 12,
    title: "Continuous Integrity",
    role: "DATA_ANALYST",
    narrative: [
      "Efficiency is an engineering virtue, Analyst. Testing everything is a waste of resources.",
      "We use 'Slim CI'—a state-aware pipeline that identifies changed models using `dbt clone` with the `--state` flag.",
      "Your mission: You've updated 'models/stg_revenue.sql'. Simulate a Slim CI run to optimize the pipeline.",
      "Precision in automation allows us to ship faster without sacrificing the ledger's integrity.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: established model logic
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
        check: (_state) => true, // Validated via the command output stream
      },
      {
        id: "push_automation",
        description:
          "Push your optimized pipeline changes to the central registry.",
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
    helpMessage: "Slim CI optimizes our infrastructure by focusing only on what has changed:\n\n1. `dbt clone --state prod`: This simulates our automated pipeline comparing your local changes against the production state. It only clones and tests the models you've actually modified.\n2. `git push origin master`: Finalize the synchronization to the central registry.\n\nAutomation is the force multiplier of a Staff Operative.",
  },
];
