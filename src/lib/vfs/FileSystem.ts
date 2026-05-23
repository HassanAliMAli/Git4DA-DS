/**
 * Virtual File System (VFS) Engine
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Why build an in-memory VFS? 
 * 1. Isolation: Git4Data is a high-fidelity simulation. We cannot risk executing 
 *    destructive `git rm` or `git reset --hard` operations on a user's actual disk.
 * 2. Ephemerality: The simulation state must be rapidly reset between 'Levels' 
 *    without leaving residue. A Map-based tree achieves this with O(1) resets.
 * 3. Sandboxing: By virtualizing the disk, we control exactly what 'files' exist,
 *    allowing us to simulate Data Crimes (e.g., committing a 1GB .pkl file) instantly
 *    without actually allocating 1GB of memory or disk space.
 */

export type FileType = "file" | "directory";

/**
 * VNode Structure:
 * We use a standard composite pattern where a node is either a 'file' (containing string data)
 * or a 'directory' (containing a Map of child VNodes).
 */
export interface VNode {
  name: string;
  type: FileType;
  content?: string; // Buffer for file data; undefined for directories
  children?: Map<string, VNode>; // Graph edges for directories; undefined for files
  metadata: {
    size: number;
    lastModified: number;
    hidden: boolean;
  };
}

export class FileSystem {
  // The absolute root of our virtual volume
  private root: VNode;

  constructor() {
    this.root = this.createDirectoryNode("/");
  }

  /**
   * Factory function to instantiate a standardized directory node.
   * Tracks POSIX-like metadata for future integration with 'ls -la' commands.
   */
  private createDirectoryNode(name: string): VNode {
    return {
      name,
      type: "directory",
      children: new Map(),
      metadata: {
        size: 0,
        lastModified: Date.now(),
        hidden: name.startsWith("."),
      },
    };
  }

  /**
   * Factory function to instantiate a standardized file node.
   * Automatically calculates byte-length for realistic size reporting.
   */
  private createFileNode(name: string, content: string = ""): VNode {
    return {
      name,
      type: "file",
      content,
      metadata: {
        size: new TextEncoder().encode(content).length, // Realistic memory footprint simulation
        lastModified: Date.now(),
        hidden: name.startsWith("."), // Native POSIX dotfile detection
      },
    };
  }

  /**
   * Normalizes absolute/relative paths by stripping empty segments.
   */
  private getPathParts(path: string): string[] {
    return path.split("/").filter((part) => part !== "");
  }

  /**
   * Path Resolution Engine
   * Traverses the VNode tree to find the target node.
   * If `createMissing` is true, it recursively builds the directory structure (`mkdir -p` behavior).
   * This is the bedrock of all file operations.
   */
  private traverse(path: string, createMissing: boolean = false): VNode | null {
    const parts = this.getPathParts(path);
    let current = this.root;

    for (const part of parts) {
      if (current.type !== "directory" || !current.children) {
        return null; // Path abruptly ends at a file, invalidating traversal
      }

      if (!current.children.has(part)) {
        if (createMissing) {
          // Auto-provision missing directory layer
          current.children.set(part, this.createDirectoryNode(part));
        } else {
          return null; // Target node does not exist
        }
      }

      current = current.children.get(part)!;
    }

    return current;
  }

  // --- Core POSIX-like Operations ---

  /**
   * Creates a new directory at the specified path.
   * Throws an exception if the directory already exists to mimic real OS behavior.
   */
  public mkdir(path: string): void {
    if (this.traverse(path)) {
      throw new Error(`Directory already exists: ${path}`);
    }
    this.traverse(path, true);
  }

  /**
   * Creates or overwrites a file.
   * Automatically provisions the parent directory structure if it is missing.
   */
  public writeFile(path: string, content: string): void {
    const parts = this.getPathParts(path);
    const fileName = parts.pop();
    if (!fileName) return; // Cannot write to root or unnamed buffer

    const dirPath = parts.join("/");
    const parentDir = this.traverse(dirPath, true);

    if (!parentDir || parentDir.type !== "directory" || !parentDir.children) {
      throw new Error(`Invalid path: ${dirPath}`);
    }

    parentDir.children.set(fileName, this.createFileNode(fileName, content));
    parentDir.metadata.lastModified = Date.now();
  }

  /**
   * Extracts the string buffer from a given file node.
   */
  public readFile(path: string): string {
    const node = this.traverse(path);
    if (!node || node.type !== "file") {
      throw new Error(`File not found: ${path}`);
    }
    return node.content || "";
  }

  public exists(path: string): boolean {
    return !!this.traverse(path);
  }

  public isDirectory(path: string): boolean {
    const node = this.traverse(path);
    return node?.type === "directory";
  }

  /**
   * Returns a list of filenames within a target directory.
   */
  public ls(path: string = "/"): string[] {
    const node = this.traverse(path);
    if (!node || node.type !== "directory" || !node.children) {
      throw new Error(`Not a directory: ${path}`);
    }
    return Array.from(node.children.keys());
  }

  /**
   * Safely deletes a file or directory.
   * To prevent memory leaks, we explicitly delete the key from the parent's Map,
   * allowing the VNode to be garbage collected.
   */
  public rm(path: string): void {
    const parts = this.getPathParts(path);
    const targetName = parts.pop();
    if (!targetName) return;

    const dirPath = parts.join("/");
    const parentDir = this.traverse(dirPath);

    if (!parentDir || parentDir.type !== "directory" || !parentDir.children) {
      throw new Error(`Invalid path: ${dirPath}`);
    }

    if (!parentDir.children.has(targetName)) {
      throw new Error(`Path does not exist: ${path}`);
    }

    parentDir.children.delete(targetName);
    parentDir.metadata.lastModified = Date.now();
  }

  public getMetadata(path: string) {
    const node = this.traverse(path);
    if (!node) {
      throw new Error(`Path does not exist: ${path}`);
    }
    return node.metadata;
  }

  // --- System Utilities ---

  /**
   * Serialization used to freeze the VFS state into LocalStorage or Cloudflare D1.
   * This allows the user's workspace to persist seamlessly between browser sessions.
   */
  public serialize(): string {
    return JSON.stringify(this.root, (_key, value) => {
      if (value instanceof Map) {
        return Object.fromEntries(value);
      }
      return value;
    });
  }
}
