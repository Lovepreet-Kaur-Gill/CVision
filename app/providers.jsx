"use client";

import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/context/UserContext";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="dark">
      <UserProvider>
        {children}
      </UserProvider>
    </ThemeProvider>
  );
}