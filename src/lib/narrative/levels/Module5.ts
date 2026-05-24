import { LevelDefinition } from "../LevelManager";

/**
 * Module 5: The Legendary Tier (Dark Arts)
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * The absolute technical ceiling. Focuses on cryptographic proof (GPG), 
 * multi-universe workflows (Worktrees), and low-level history recovery 
 * (Reflog). This is where the 'PhD' is earned.
 */
export const MODULE_5_LEVELS: LevelDefinition[] = [
  {
    id: 17,
    title: "The Ghost in the Ledger",
    role: "BOTH",
    narrative: [
      "You have made a grave error, Operative. You performed a 'hard reset' and orphaned 4 hours of production SQL logic.",
      "In a normal firm, you would be fired. At DataPulse, we reach into the `git reflog`—the ghost history of Git.",
      "Even when a branch pointer moves, the underlying objects remain for a time. Find the hash of your lost logic in the reflog.",
      "Resurrect the lost snapshot using `git reset --hard`. Prove to me that nothing is ever truly lost in a professional registry.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: accidental data loss via hard reset
      state.git.init();
      state.fs.writeFile("/logic.sql", "SELECT 'LOST_VALUABLE_DATA';");
      await state.git.add("logic.sql");
      const lostHash = await state.git.commit("feat: valuable work", "User");
      
      // The Disaster
      await state.git.reset("HEAD~1", "hard");
      // Logic: Store the lost hash in a VFS metadata file for user discovery (simulating memory)
      state.fs.writeFile("/.recovery_tip", `REFLOG_HINT: ${lostHash.substring(0, 7)}`);
    },
    goals: [
      {
        id: "view_reflog",
        description: "Audit the ghost logs (git reflog).",
        check: (_state) => true,
      },
      {
        id: "resurrect",
        description: "Restore the orphaned logic to master.",
        check: (state) => state.fs.exists("logic.sql") && state.fs.readFile("logic.sql").includes("LOST"),
      },
    ],
    hints: [
      "Run 'git reflog' to see the movements of HEAD. Find the hash before the 'reset' action.",
      "Use 'git reset --hard <lost-hash>' to travel back to the orphaned state.",
    ],
    helpMessage: "The reflog is the ultimate safety net, recording every movement of HEAD:\n\n1. `git reflog`: This displays the hidden history of branch movements. Look for the entry labeled 'moving from master to HEAD~1' or similar.\n2. Identify the hash: Copy the hash of the state *immediately before* the reset happened (titled 'feat: valuable work').\n3. `git reset --hard <hash>`: Force the master branch to point back to that orphaned commit.\n\nYou have successfully reached into the ghost history to salvage our firm's assets.",
  },
  {
    id: 18,
    title: "The Parallel Universe",
    role: "BOTH",
    narrative: [
      "Context switching is the 'Silent Killer' of engineering throughput.",
      "You are mid-refactor on 'v2_pipeline', but an emergency bug just hit 'v1_production'.",
      "Do not stash. Do not commit messy work. Use `git worktree add` to project a second, independent workspace into our VFS.",
      "Fix the bug in the production universe while your refactor remains untouched in the original. Master the art of being in two places at once.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: active refactor pending emergency bugfix
      state.git.init();
      state.fs.writeFile("/production.sql", "SELECT 1;");
      await state.git.add("production.sql");
      await state.git.commit("feat: stable v1", "Dr. Hassan");
      
      state.fs.writeFile("/refactor.sql", "SELECT 'IN_PROGRESS';");
    },
    goals: [
      {
        id: "add_worktree",
        description: "Spin up a production worktree at '/emergency_fix'.",
        check: (state) => state.git.getWorktrees().some((wt) => wt.path === "/emergency_fix"),
      },
    ],
    hints: [
      "The command is 'git worktree add /emergency_fix master'.",
    ],
    helpMessage: "Stashing is for amateurs. Professional engineers use multiple universes:\n\n1. `git worktree add /emergency_fix master`: This command materializes the 'master' branch into a completely separate directory named `/emergency_fix`. Your current workspace remains exactly as it is.\n\nYou can now navigate between both environments without ever losing your context.",
  },
  {
    id: 19,
    title: "The Cryptographic Seal",
    role: "BOTH",
    narrative: [
      "Identity is easily forged. Proof is not.",
      "Anyone can set their 'user.name' to Dr. Hassan. But they cannot mimic my GPG signature.",
      "At DataPulse, high-impact logic must be 'Signed'. Configure your key via `git config` and commit using the `-S` flag.",
      "A professional registry only trusts snapshots that carry a verified cryptographic seal.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: algorithm ready for signing
      state.git.init();
      state.fs.writeFile("/algorithm.py", "predict_alpha()");
    },
    goals: [
      {
        id: "config_gpg",
        description: "Register your signing key (git config --global user.signingkey 0xABC).",
        check: (state) => !!state.git.getConfig("user.signingkey"),
      },
      {
        id: "signed_commit",
        description: "Snapshot the algorithm with a GPG seal (git commit -S).",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          // Logic: Verify that the latest commit object contains a signature property
          return commits.length > 0 && !!commits[0].signature;
        },
      },
    ],
    hints: [
      "First, set the config: 'git config --global user.signingkey 0x4A7F9C2D'.",
      "Then, add and commit with the '-S' flag: 'git commit -S -m \"feat: signed algorithm\"'.",
    ],
    helpMessage: "Cryptographic signatures provide absolute proof of authorship:\n\n1. `git config user.signingkey 0x4A7F9C2D`: Register your public key ID in the workstation configuration.\n2. `git add algorithm.py`: Stage the production algorithm.\n3. `git commit -S -m \"feat: sign production algorithm\"`: The `-S` flag tells Git to use GPG to seal this snapshot. Without this, your logic is unverified.\n\nNow, anyone auditing this ledger can verify that you—and only you—authorized this math.",
  },
  {
    id: 20,
    title: "The Staff Alchemist",
    role: "BOTH",
    narrative: [
      "You have traversed the ledger, shielded the lineage, and woven the history of this firm.",
      "The final trial is a test of 'Absolute Integrity'. You have a complex merge conflict involving GPG-signed logic and DVC pointers.",
      "Unify the production state. Sign the result. Prove to me that you are not just an operative, but a Staff Alchemist.",
      "The registry is yours. Make it perfect.",
      "If you find the technical requirements beyond your current capacity, type 'help' in this channel for my full protocol.",
    ],
    setup: async (state) => {
      // Scenario provisioning: the ultimate multi-variable conflict
      state.git.init();
      state.git.setConfig("user.signingkey", "0xGOLD");
      state.fs.writeFile("/final_model.py", "# Master Algorithm");
      await state.git.add("final_model.py");
      await state.git.commit("feat: the origin", "Dr. Hassan");
    },
    goals: [
      {
        id: "final_merge",
        description: "Complete the final resolution and sign the merger.",
        check: (state) => {
          const commits = state.git.getGraph().commits;
          // Logic: Audit for both merge success and cryptographic signature
          return (
            commits.length > 1 &&
            !!commits[0].signature &&
            commits[0].message.toLowerCase().includes("merge")
          );
        },
      },
    ],
    hints: [
      "This is your final exam. Use everything you have learned. Branch, conflict, resolve, sign, and push.",
    ],
    helpMessage: "This is your final certification. The firm requires a unified, signed prod state:\n\n1. Identify the conflict: Use the tools you have mastered to merge diverging branches.\n2. Resolve: Manually unify the logic, ensuring DVC pointers are correctly preserved.\n3. Sign: Use `git commit -S` to finalize the merge with your cryptographic seal.\n\nCompleting this mission marks your transition from Junior Operative to Staff Alchemist. History is in your hands.",
  },
];
