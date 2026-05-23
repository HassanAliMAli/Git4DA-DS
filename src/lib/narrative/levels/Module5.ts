import { LevelDefinition } from "../LevelManager";

export const MODULE_5_LEVELS: LevelDefinition[] = [
  {
    id: 17,
    title: "The Reflog Resurrection",
    role: "BOTH",
    narrative: [
      "Panic is the mark of an amateur, Operative. In Git, nothing is ever truly lost.",
      "A junior analyst just ran 'git reset --hard HEAD~1' and believes they've wiped out their 'advanced_model.py'. they are wrong.",
      "While the branch pointer has moved, the orphaned snapshot still lives in the object database. We use the 'Reflog' to find it.",
      "Your mission: Use 'git reflog' to find the hash of the commit titled 'feat: advanced model' and resurrect it.",
      "In the Dark Arts, we don't fear deletion. We master recovery.",
    ],
    setup: async (state) => {
      state.git.init();
      
      // Step 1: Baseline
      state.fs.writeFile("/baseline.py", "# v1.0");
      await state.git.add("baseline.py");
      await state.git.commit("feat: baseline", "Dr. Hassan");

      // Step 2: The "Lost" work
      state.fs.writeFile("/advanced_model.py", "model.train(deep=True)");
      await state.git.add("advanced_model.py");
      const lostHash = await state.git.commit("feat: advanced model", "User");

      // Step 3: THE DESTRUCTION
      await state.git.reset("HEAD~1", "hard");
      // Verify file is gone from VFS
      if (state.fs.exists("advanced_model.py")) {
         state.fs.rm("advanced_model.py");
      }
    },
    goals: [
      {
        id: "resurrect_work",
        description: "Recover the lost 'advanced_model.py' using the reflog.",
        check: (state) => {
          return state.fs.exists("advanced_model.py") && 
                 state.git.getGraph().commits.some(c => c.message === "feat: advanced model");
        },
      },
    ],
    hints: [
      "Run 'git reflog' to see the history of where your HEAD has been.",
      "Identify the hash before the 'reset' operation.",
      "Use 'git reset --hard <hash>' to force the branch back to that state.",
    ],
  },
];
