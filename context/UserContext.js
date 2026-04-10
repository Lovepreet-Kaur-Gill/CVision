"use client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [sharedResumeText, setSharedResumeText] = useState("");

  return (
    <UserContext.Provider value={{ sharedResumeText, setSharedResumeText }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);