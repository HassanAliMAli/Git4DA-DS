"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole, INITIAL_PROFILE } from "@/models/Profile";

/**
 * Global Profile Context
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * This Context manages the persistent state of the user across the entire application.
 * It is responsible for role assignment (Analyst vs. Scientist), XP progression, 
 * and level tracking.
 * 
 * By elevating this state globally, we ensure that the entire application—from the 
 * Landing Page to the Terminal UI—dynamically reacts to the user's specific career track 
 * and progress without needing prop drilling. Currently backed by LocalStorage, designed 
 * for future integration with a Cloudflare D1 database.
 */

interface ProfileContextType {
  profile: UserProfile | null;
  setRole: (role: UserRole, name: string) => Promise<void>;
  updateXP: (amount: number) => Promise<void>;
  isLoaded: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("datapulse_profile");
    if (savedProfile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(JSON.parse(savedProfile));
    }
    setIsLoaded(true);
  }, []);

  const setRole = async (role: UserRole, name: string) => {
    const newProfile: UserProfile = {
      ...INITIAL_PROFILE,
      id: crypto.randomUUID(),
      name,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UserProfile;

    setProfile(newProfile);
    localStorage.setItem("datapulse_profile", JSON.stringify(newProfile));

    // TODO: In production, sync with Cloudflare D1 here
  };

  const updateXP = async (amount: number) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      xp: profile.xp + amount,
      updatedAt: new Date().toISOString(),
    };

    setProfile(updatedProfile);
    localStorage.setItem("datapulse_profile", JSON.stringify(updatedProfile));
  };

  return (
    <ProfileContext.Provider value={{ profile, setRole, updateXP, isLoaded }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
