import { describe, it, expect, beforeEach } from "vitest";
import { GitRepository } from "./GitRepository";
import { FileSystem } from "../vfs/FileSystem";

describe("GitRepository", () => {
  let fs: FileSystem;
  let git: GitRepository;

  beforeEach(() => {
    fs = new FileSystem();
    git = new GitRepository(fs);
  });

  it("should add files to the index", async () => {
    fs.writeFile("/test.txt", "hello world");
    await git.add("/test.txt");

    // Check if object was hashed and stored
    const contentHash = await git.hashObject("hello world", "blob", false);
    const storedObject = git.getObject(contentHash);
    expect(storedObject).toBeDefined();
    expect(storedObject?.data).toBe("hello world");
  });

  it("should create a commit successfully", async () => {
    fs.writeFile("/script.py", 'print("Hello DataPulse")');
    await git.add("/script.py");

    const message = "Initial analytical script";
    const author = "Hassan";
    const commitHash = await git.commit(message, author);

    expect(commitHash).toBeDefined();
    expect(git.getCurrentCommit()).toBe(commitHash);

    const commitObj = git.getObject(commitHash);
    expect(commitObj?.type).toBe("commit");
    const commitData = JSON.parse(commitObj?.data || "{}");
    expect(commitData.message).toBe(message);
    expect(commitData.author).toBe(author);
  });

  it("should maintain a reflog for all actions", async () => {
    fs.writeFile("/data.csv", "id,val\n1,100");
    await git.add("/data.csv");
    const commitHash = await git.commit("Add data", "Hassan");

    const reflog = git.getReflog();
    expect(reflog.length).toBeGreaterThan(0);
    expect(reflog[0].newHash).toBe(commitHash);
    expect(reflog[0].message).toContain("commit: Add data");
  });

  it("should handle branching and checkout", async () => {
    fs.writeFile("/base.txt", "base");
    await git.add("/base.txt");
    const firstCommit = await git.commit("Base", "Hassan");

    await git.branch("experiment-v1");
    git.checkout("experiment-v1");
    expect(git.getHead()).toBe("experiment-v1");
    expect(git.getCurrentCommit()).toBe(firstCommit);

    fs.writeFile("/exp.txt", "exp");
    await git.add("/exp.txt");
    const secondCommit = await git.commit("Experimental result", "Hassan");

    expect(git.getCurrentCommit()).toBe(secondCommit);

    // Back to master
    git.checkout("master");
    expect(git.getCurrentCommit()).toBe(firstCommit);
  });
});
