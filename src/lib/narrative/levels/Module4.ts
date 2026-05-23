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
];
