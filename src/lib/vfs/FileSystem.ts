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
 * 
 * DATA STRUCTURE:
 * The VFS is implemented as a Recursive Directed Acyclic Graph (DAG) of VNodes.
 * While it mimics a traditional N-ary tree, the Map-based adjacency list provides
 * O(1) lookup for child nodes, ensuring the terminal feels snappy even with
 * complex directory structures.
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
    size: number; // Simulated byte-count for audit reporting
    lastModified: number; // Unix timestamp for 'ls -l' simulation
    hidden: boolean; // POSIX-compliant dotfile flag
  };
}

export class FileSystem {
  /**
   * The absolute root of our virtual volume.
   * Every path resolution begins here.
   */
  private root: VNode;

  constructor() {
    this.root = this.createDirectoryNode("/");
  }

  /**
   * Factory function to instantiate a standardized directory node.
   * Tracks POSIX-like metadata for future integration with 'ls -la' commands.
   * 
   * @param name The name of the directory segment
   * @returns A fully initialized directory VNode
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
   * 
   * @param name The filename
   * @param content The string buffer to be stored
   * @returns A fully initialized file VNode
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
   * 
   * @param path The raw path string (e.g. "/src/lib//git")
   * @returns An array of sanitized path segments (e.g. ["src", "lib", "git"])
   */
  private getPathParts(path: string): string[] {
    return path.split("/").filter((part) => part !== "");
  }

  /**
   * Path Resolution Engine
   * Traverses the VNode tree to find the target node.
   * If `createMissing` is true, it recursively builds the directory structure (`mkdir -p` behavior).
   * This is the bedrock of all file operations.
   * 
   * Complexity: O(N) where N is the depth of the path.
   * 
   * @param path The target path
   * @param createMissing Flag to enable recursive directory creation
   * @returns The target VNode, or null if resolution fails
   */
  private traverse(path: string, createMissing: boolean = false): VNode | null {
    const parts = this.getPathParts(path);
    let current = this.root;

    for (const part of parts) {
      // If we encounter a file while we still have path segments, traversal fails
      if (current.type !== "directory" || !current.children) {
        return null;
      }

      if (!current.children.has(part)) {
        if (createMissing) {
          // Auto-provision missing directory layer (equivalent to mkdir -p)
          current.children.set(part, this.createDirectoryNode(part));
        } else {
          return null; // Target node does not exist in the graph
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
   * 
   * @param path Target filepath
   * @param content String data to write
   */
  public writeFile(path: string, content: string): void {
    const parts = this.getPathParts(path);
    const fileName = parts.pop();
    if (!fileName) return; // Protection against root writes

    const dirPath = parts.join("/");
    const parentDir = this.traverse(dirPath, true);

    if (!parentDir || parentDir.type !== "directory" || !parentDir.children) {
      throw new Error(`Invalid path: ${dirPath}`);
    }

    // Atomic update of the child Map
    parentDir.children.set(fileName, this.createFileNode(fileName, content));
    parentDir.metadata.lastModified = Date.now();
  }

  /**
   * Extracts the string buffer from a given file node.
   * 
   * @param path Target filepath
   * @returns The file content
   * @throws Error if file does not exist or is a directory
   */
  public readFile(path: string): string {
    const node = this.traverse(path);
    if (!node || node.type !== "file") {
      throw new Error(`File not found: ${path}`);
    }
    return node.content || "";
  }

  /**
   * Checks for the existence of a node at the given path.
   */
  public exists(path: string): boolean {
    return !!this.traverse(path);
  }

  /**
   * Type-check for directory nodes.
   */
  public isDirectory(path: string): boolean {
    const node = this.traverse(path);
    return node?.type === "directory";
  }

  /**
   * Returns a list of filenames within a target directory.
   * Implements standard 'ls' behavior.
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

    // Surgical removal from the graph
    parentDir.children.delete(targetName);
    parentDir.metadata.lastModified = Date.now();
  }

  /**
   * Retrieves simulated technical metadata for a node.
   */
  public getMetadata(path: string): { size: number; lastModified: number; hidden: boolean } {
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
   * 
   * Note: Maps are not natively JSON-serializable, so we convert them to plain objects.
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
