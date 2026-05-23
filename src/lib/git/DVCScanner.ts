import { FileSystem } from "../vfs/FileSystem";

export interface DataCrime {
  path: string;
  type: "LARGE_BINARY" | "UNMASKED_SECRET" | "RAW_DATASET";
  severity: "CRITICAL" | "WARNING";
  description: string;
}

/**
 * Data Hygiene & Compliance Scanner (DVCScanner)
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * At DataPulse, Git is for logic, not for mass. This engine audits the VFS 
 * for "Data Crimes"—anti-patterns where large binaries or raw datasets are 
 * committed directly to history instead of using DVC pointers.
 * 
 * It acts as a simulated 'pre-commit hook' that enforces the firm's data 
 * integrity policies.
 */
export class DVCScanner {
  constructor(private fs: FileSystem) {}

  /**
   * Performs a recursive sweep of the VFS to identify hygiene violations.
   */
  public scan(): DataCrime[] {
    const crimes: DataCrime[] = [];
    this.walk("/", crimes);
    return crimes;
  }

  private walk(path: string, crimes: DataCrime[]): void {
    if (!this.fs.exists(path)) return;

    if (this.fs.isDirectory(path)) {
      const files = this.fs.ls(path);
      for (const file of files) {
        const fullPath = path === "/" ? `/${file}` : `${path}/${file}`;
        this.walk(fullPath, crimes);
      }
    } else {
      this.auditFile(path, crimes);
    }
  }

  /**
   * Applies heuristic rules to a specific file node.
   */
  private auditFile(path: string, crimes: DataCrime[]): void {
    const fileName = path.split("/").pop() || "";
    
    // Rule 1: Large Binary Detection (Simulated)
    if (fileName.endsWith(".pkl") || fileName.endsWith(".model")) {
      crimes.push({
        path,
        type: "LARGE_BINARY",
        severity: "CRITICAL",
        description: "Large model weights detected. Must use 'dvc add' to establish a pointer.",
      });
    }

    // Rule 2: Raw Dataset Detection
    if (fileName.endsWith(".csv") || fileName.endsWith(".parquet")) {
      // Check if it's shielded by .gitignore (In a real app, we'd check the git index)
      crimes.push({
        path,
        type: "RAW_DATASET",
        severity: "WARNING",
        description: "Raw data identified in workspace. Verification of .gitignore shield required.",
      });
    }

    // Rule 3: Secret Leakage (Heuristic)
    if (fileName === ".env") {
      crimes.push({
        path,
        type: "UNMASKED_SECRET",
        severity: "CRITICAL",
        description: "Environment variables detected. Leakage risk: HIGH.",
      });
    }
  }
}
