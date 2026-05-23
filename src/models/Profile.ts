export type UserRole = "DATA_ANALYST" | "DATA_SCIENTIST";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  xp: number;
  level: number;
  unlockedThemes: string[];
  achievements: string[];
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_PROFILE: Partial<UserProfile> = {
  xp: 0,
  level: 1,
  unlockedThemes: ["default"],
  achievements: [],
};
