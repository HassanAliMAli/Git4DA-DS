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
  {
    id: 15,
    title: "The Data Detective",
    role: "BOTH",
    narrative: [
      "Accuracy is the pulse of the firm, and the pulse is dropping.",
      "Sometime in the last 10 snapshots, a 'Data Bug' was introduced that tanked our model precision from 94% to 12%.",
      "Manually checking each commit is for clerks. A Staff Alchemist uses 'git bisect'.",
      "Your mission: Use binary search to find the exact commit that broke the logic. Mark the origin as 'good' and the HEAD as 'bad'.",
      "Hunt the bug. Restore the precision.",
    ],
    setup: async (state) => {
      state.git.init();
      // Create a 10-commit history
      for (let i = 1; i <= 10; i++) {
        const val = i === 6 ? "0.12" : "0.94"; // Bug introduced at commit 6
        state.fs.writeFile("/accuracy.txt", `model_precision: ${val}`);
        await state.git.add("accuracy.txt");
        await state.git.commit(`feat: snapshot ${i}`, "Dr. Hassan");
      }
    },
    goals: [
      {
        id: "bisect_bug",
        description: "Identify the first bad commit using 'git bisect'.",
        check: (state) => {
          const graph = state.git.getGraph();
          const firstBad = graph.commits.find((c) => c.message === "feat: snapshot 6");
          // Check if bisect found it (simulated via log message or state check)
          return state.git.getCurrentCommit() === firstBad?.hash;
        },
      },
    ],
    hints: [
      "Start with 'git bisect start'.",
      "Mark current state: 'git bisect bad'.",
      "Mark the first commit: 'git log' to find hash, then 'git bisect good <hash>'.",
      "Test each jump: 'cat accuracy.txt'. If 0.12, run 'git bisect bad'. If 0.94, run 'git bisect good'.",
    ],
  },
];
