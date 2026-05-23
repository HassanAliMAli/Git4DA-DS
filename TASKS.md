# Project TASKS: Git4Data (Legendary Path)

## Phase 0: Environment & Project Scaffolding
- [x] Initialize Next.js 15+ project with TypeScript (Strict Mode)
- [x] Configure **Tailwind CSS v4** with "Ink/Sage" world-class theme
- [x] Setup ESLint and Prettier for strict engineering standards
- [x] Configure **OpenNext Cloudflare Adapter** for Next.js 15
- [x] Initialize `wrangler.jsonc` with `nodejs_compat` enabled
- [x] Initialize `src/` folder structure
- [x] Create `TASKS.md` (Self-tracking initialization)
- [x] **Total Aesthetic Overhaul**: Migrated to expansive Ink/Sage landing page

---

## Phase 1: The Narrative & Onboarding (Ink/Sage Edition)
### 1.1 Profile Selection System
- [x] Design `src/models/Profile.ts` interface
- [x] Create `src/contexts/ProfileContext.tsx`
- [x] Rebuild `ProfileSelection` UI with Ink/Sage expansive cards
- [x] Write Dr. Hassan's "Welcome to the Forge" introductory scripts

### 1.2 Narrative Engine
- [ ] Rebuild `DrHassanAdvisor` component (Sage-gradient popup with Framer Motion)
- [x] Implement "Typewriter" effect logic
- [ ] Add sound triggers for Dr. Hassan's "Audit Warnings" and "Sage Approval" [Postponed for sound asset availability]

---
## Phase 2: The Core Simulation Engine (The "Heart")
### 2.1 Virtual File System (VFS)
- [x] Implement `FileSystem.ts`:
    - [x] In-memory tree structure for folders/files
    - [x] File operations: `mkdir`, `rm`, `touch`, `write`, `read`
    - [x] Support for metadata (file size, hidden status)
- [x] Unit tests for VFS operations

### 2.2 Git Simulation Engine (The PhD Layer)
- [x] Implement `GitRepository.ts`:
    - [x] Object Database (Blobs, Trees, Commits)
    - [x] Ref Management (`HEAD`, branches, tags)
    - [x] Staging Area (Index) logic
    - [x] **Ultra Hero Feature**: Implement `Reflog` to track every pointer move
    - [x] **Legendary Feature**: Integrate `GPG Signature` data fields
- [x] Implement `GitCommandProcessor.ts`
- [x] Unit tests for Git engine operations

### 2.3 Specialized Data Components
- [x] Build `NotebookViewer.tsx` (Renders JSON `.ipynb` as visual cells)
- [x] Build `SQLViewer.tsx` (Syntax highlighted SQL editor)
- [x] Build `GitGraphVisualizer.tsx` (SVG based commit tree)
- [x] Build `DVCScanner.ts` (Data hygiene and compliance auditor)

---

## Phase 3: The 20-Level Implementation (The Path)

### Module 1: The Safety Net (Foundation)
- [x] **Level 1**: Implement `init`, `add`, `commit` challenge
- [x] **Level 2**: Implement `.gitignore` auditor (Blocks commits if `.csv` is present)
- [x] **Level 3**: Implement `status`/`log` visualization
- [x] **Level 4**: Implement `revert` challenge (The "Data Disaster" recovery)

### Module 2: The Collaboration Protocol
- [x] **Level 5**: Implement basic branching (`git branch`, `git checkout`)
- [x] **Level 6**: Implement simulated `remote` and `push` to "DataPulse Central"
- [x] **Level 7**: Implement Merge Conflict scenario (Simulated conflicting SQL files)
- [x] **Level 8**: Implement "Pull Request" UI (Dr. Hassan's logic audit)

### Module 3A: Data Analyst "Insights Architect" Track
- [x] **Level 9**: Implement dbt-style "State" versioning simulation
- [x] **Level 10**: Implement `Jupytext` workflow (Syncing `.ipynb` to `.py`)
- [x] **Level 11**: Implement `SQLFluff` linting gate (Blocks commits with poor formatting)
- [x] **Level 12**: Implement "Slim CI" (Only testing modified models)

### Module 3B: Data Scientist "Production Alchemist" Track
- [x] **Level 9**: Implement DVC Pointer creation (`dvc add`)
- [x] **Level 10**: Implement "Commit-to-Experiment" linking (MLflow simulation)
- [x] **Level 11**: Implement "Feature Definition" versioning challenge
- [x] **Level 12**: Implement "Git-Triggered Training" (Simulated GitHub Action)

### Module 4 & 5: The Legendary Tier (The Dark Arts)
- [x] **Level 13**: Implement `sparse-checkout` (Large repo navigation)
- [x] **Level 14**: Implement Interactive Rebase challenge (`rebase -i`)
- [x] **Level 15**: Implement `git bisect` (Hunting the "Data Bug")
- [x] **Level 16**: Implement `git filter-repo` (Purging sensitive CSVs)
- [x] **Level 17**: **Legendary**: Implement `reflog` recovery of uncommitted work
- [x] **Level 18**: **Legendary**: Implement `git worktree` UI (Parallel experimentation)
- [x] **Level 19**: **Legendary**: Implement GPG Signing workflow
- [x] **Level 20**: **Legendary**: Final Capstone: Managing a simulated monorepo with VFS

---

## Phase 4: Gamification & Polish
- [ ] Implement XP/Coin reward system
- [ ] Build the "Shop" for Terminal Themes (Matrix, Cyberpunk, DataPulse Gold)
- [ ] Implement achievement badges (e.g., "Reflog Archaeologist", "Signer of Truth")
- [ ] Final audio pass (Environmental ambiance for DataPulse HQ)
- [ ] Mobile-responsiveness check for the terminal interface

---

## Phase 5: Verification & Launch
- [ ] End-to-end testing of all 20 levels
- [ ] Performance audit for the in-memory Git engine
- [ ] Final Dr. Hassan dialogue review
- [ ] Configure **Cloudflare D1**, **KV**, and **R2** bindings in production
- [ ] Deploy to **Cloudflare Workers / Pages** via Wrangler CLI
