import { GitObjectType } from "./types";

export async function calculateHash(
  type: GitObjectType,
  content: string,
): Promise<string> {
  const data = `${type} ${content.length}\0${content}`;
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function matchesPattern(path: string, patterns: string[]): boolean {
  return patterns.some((pattern: string) => {
    const regexPattern = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    const fileName = path.split("/").pop() || "";
    return regex.test(fileName) || regex.test(path);
  });
}
