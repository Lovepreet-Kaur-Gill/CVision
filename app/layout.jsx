import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import { Providers } from "./providers";
import { ClerkProvider } from "@clerk/nextjs"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CVision AI | Premium Career Toolkit",
  description: "AI Resume Builder & Job Finder",
  icons: {
    icon: '/icon.png', 
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-black`}>
          <Providers>
            
            <Preloader />
            
            <Navbar />
            <main className="min-h-screen bg-transparent transition-colors duration-300">
              {children}
            </main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}