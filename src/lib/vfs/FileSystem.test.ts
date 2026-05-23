import { describe, it, expect, beforeEach } from "vitest";
import { FileSystem } from "./FileSystem";

describe("FileSystem", () => {
  let fs: FileSystem;

  beforeEach(() => {
    fs = new FileSystem();
  });

  it("should create directories correctly", () => {
    fs.mkdir("/data");
    expect(fs.exists("/data")).toBe(true);
    expect(fs.isDirectory("/data")).toBe(true);
  });

  it("should write and read files correctly", () => {
    const content = "id,name\n1,Hassan";
    fs.writeFile("/data/users.csv", content);
    expect(fs.exists("/data/users.csv")).toBe(true);
    expect(fs.readFile("/data/users.csv")).toBe(content);
  });

  it("should list directory contents", () => {
    fs.mkdir("/scripts");
    fs.writeFile("/scripts/clean.py", 'print(\"Cleaning\")');
    fs.writeFile("/scripts/train.py", 'print(\"Training\")');

    const contents = fs.ls("/scripts");
    expect(contents).toContain("clean.py");
    expect(contents).toContain("train.py");
    expect(contents).toHaveLength(2);
  });

  it("should remove files and directories", () => {
    fs.writeFile("/temp.txt", "test");
    expect(fs.exists("/temp.txt")).toBe(true);

    fs.rm("/temp.txt");
    expect(fs.exists("/temp.txt")).toBe(false);
  });

  it("should throw errors for invalid operations", () => {
    expect(() => fs.readFile("/nonexistent.txt")).toThrow();
    expect(() => fs.ls("/nonexistent_dir")).toThrow();
  });
});
