"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { TUser } from "../types";

export type UserContextType = {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
};

export const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<TUser | null>(null);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUserState(JSON.parse(localStorage.getItem("user")!));
    }
  }, []);
  const setUser = (user: TUser | null) => {
    setUserState(user);
    localStorage.setItem("user", JSON.stringify(user));
  };
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
export function UseUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return { user: context.user, setUser: context.setUser };
}
