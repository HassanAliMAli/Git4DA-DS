import { LevelDefinition } from "../LevelManager";

export const MODULE_4_LEVELS: LevelDefinition[] = [
  {
    id: 13,
    title: "The Monorepo Maze",
    role: "BOTH",
    narrative: [
      "Welcome to the Big Tech Tier. Linear repositories are for startups. Real engineering happens in the 'Monorepo'.",
      "At firms like Meta or Google, repositories contain trillions of lines. Checking out the whole tree would crash your machine.",
      "We use 'sparse-checkout' to filter the noise. Your mission: The monorepo has thousands of folders. You only care about '/data/models/'.",
      "Use 'git sparse-checkout set data/models' to isolate your team's work. Master the scale of giants.",
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.mkdir("frontend");
      state.fs.mkdir("backend");
      state.fs.mkdir("infrastructure");
      state.fs.mkdir("data");
      state.fs.mkdir("data/models");
      state.fs.writeFile("/data/models/config.yaml", "model_version: 1.0");
    },
    goals: [
      {
        id: "set_sparse",
        description: "Initialize sparse-checkout for 'data/models'.",
        check: (state) => true, // Validated via the command output signal in the orchestrator
      },
    ],
    hints: [
      "The command is 'git sparse-checkout set data/models'.",
      "This pattern allows you to work in a massive repo as if it were a small, local project.",
    ],
  },
  {
    id: 14,
    title: "The History Weaver",
    role: "BOTH",
    narrative: [
      "Messy history is the sign of a cluttered mind, Operative.",
      "I noticed you've pushed three rapid, sloppy commits to your local branch: 'WIP 1', 'bug fix', and 'final test'.",
      "At DataPulse, we only allow 'Atomic Commits' into the production registry. We don't record our stumbles; we only record our progress.",
      "Your mission: Use 'git rebase -i HEAD~3' to squash those redundant snapshots into a single, clean 'feat: optimize revenue pipeline' commit.",
      "Weave the history you want the world to see.",
    ],
    setup: async (state) => {
      state.git.init();
      state.fs.writeFile("/logic.sql", "-- version 1");
      await state.git.add("logic.sql");
      await state.git.commit("WIP 1", "User");
      
      state.fs.writeFile("/logic.sql", "-- version 2");
      await state.git.add("logic.sql");
      await state.git.commit("bug fix", "User");
      
      state.fs.writeFile("/logic.sql", "-- version 3");
      await state.git.add("logic.sql");
      await state.git.commit("final test", "User");
    },
    goals: [
      {
        id: "squash_history",
        description: "Squash the 3 messy commits into 1 clean commit using 'git rebase -i'.",
        check: (state) => {
          const graph = state.git.getGraph();
          // We check if the commit count for the current branch is exactly 1 (or reduced)
          return graph.commits.length === 1 && !graph.commits[0].message.toLowerCase().includes("wip");
        },
      },
    ],
    hints: [
      "The command is 'git rebase -i HEAD~3'.",
      "In the rebase UI, change 'pick' to 'squash' for the bottom two commits.",
    ],
  },
];
