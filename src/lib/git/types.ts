export type GitObjectType = "blob" | "tree" | "commit";

export interface GitObject {
  hash: string;
  type: GitObjectType;
  data: string;
}

export interface GitCommit {
  tree: string; // Hash of the root tree
  parent: string | null;
  author: string;
  message: string;
  timestamp: number;
  signature?: string; // GPG Signature
}

export interface GitTreeEntry {
  name: string;
  hash: string;
  type: "blob" | "tree";
}

export interface ReflogEntry {
  ref: string;
  oldHash: string | null;
  newHash: string;
  message: string;
  timestamp: number;
}
