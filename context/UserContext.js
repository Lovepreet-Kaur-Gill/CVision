"use client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  // Isme hum analyze kiya hua resume text store karenge
  const [sharedResumeText, setSharedResumeText] = useState("");

  return (
    <UserContext.Provider value={{ sharedResumeText, setSharedResumeText }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook taaki kisi bhi page par use karna aasaan ho
export const useUser = () => useContext(UserContext);