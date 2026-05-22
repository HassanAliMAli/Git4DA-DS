export type FileType = 'file' | 'directory';

export interface VNode {
  name: string;
  type: FileType;
  content?: string; // Only for files
  children?: Map<string, VNode>; // Only for directories
  metadata: {
    size: number;
    lastModified: number;
    hidden: boolean;
  };
}

export class FileSystem {
  private root: VNode;

  constructor() {
    this.root = this.createDirectoryNode('/');
  }

  private createDirectoryNode(name: string): VNode {
    return {
      name,
      type: 'directory',
      children: new Map(),
      metadata: {
        size: 0,
        lastModified: Date.now(),
        hidden: name.startsWith('.'),
      },
    };
  }

  private createFileNode(name: string, content: string = ''): VNode {
    return {
      name,
      type: 'file',
      content,
      metadata: {
        size: new TextEncoder().encode(content).length,
        lastModified: Date.now(),
        hidden: name.startsWith('.'),
      },
    };
  }

  private getPathParts(path: string): string[] {
    return path.split('/').filter(part => part !== '');
  }

  private traverse(path: string, createMissing: boolean = false): VNode | null {
    const parts = this.getPathParts(path);
    let current = this.root;

    for (const part of parts) {
      if (current.type !== 'directory' || !current.children) {
        return null;
      }

      if (!current.children.has(part)) {
        if (createMissing) {
          current.children.set(part, this.createDirectoryNode(part));
        } else {
          return null;
        }
      }

      current = current.children.get(part)!;
    }

    return current;
  }

  public mkdir(path: string): void {
    if (this.traverse(path)) {
      throw new Error(`Directory already exists: ${path}`);
    }
    this.traverse(path, true);
  }

  public writeFile(path: string, content: string): void {
    const parts = this.getPathParts(path);
    const fileName = parts.pop();
    if (!fileName) return;

    const dirPath = parts.join('/');
    const parentDir = this.traverse(dirPath, true);

    if (!parentDir || parentDir.type !== 'directory' || !parentDir.children) {
      throw new Error(`Invalid path: ${dirPath}`);
    }

    parentDir.children.set(fileName, this.createFileNode(fileName, content));
    parentDir.metadata.lastModified = Date.now();
  }

  public readFile(path: string): string {
    const node = this.traverse(path);
    if (!node || node.type !== 'file') {
      throw new Error(`File not found: ${path}`);
    }
    return node.content || '';
  }

  public exists(path: string): boolean {
    return !!this.traverse(path);
  }

  public isDirectory(path: string): boolean {
    const node = this.traverse(path);
    return node?.type === 'directory';
  }

  public ls(path: string = '/'): string[] {
    const node = this.traverse(path);
    if (!node || node.type !== 'directory' || !node.children) {
      throw new Error(`Not a directory: ${path}`);
    }
    return Array.from(node.children.keys());
  }

  public rm(path: string): void {
    const parts = this.getPathParts(path);
    const targetName = parts.pop();
    if (!targetName) return;

    const dirPath = parts.join('/');
    const parentDir = this.traverse(dirPath);

    if (!parentDir || parentDir.type !== 'directory' || !parentDir.children) {
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

  public serialize(): string {
    // Utility to save state to LocalStorage/D1
    return JSON.stringify(this.root, (key, value) => {
      if (value instanceof Map) {
        return Object.fromEntries(value);
      }
      return value;
    });
  }
}
