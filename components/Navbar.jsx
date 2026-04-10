"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ScanSearch, 
  Globe2,
  Layers3,
  User
} from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Navbar() {
  // 1. All hooks must be at the top
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  // 2. Effects
  useEffect(() => setMounted(true), []);

  // Smart Scroll Logic for Mobile Bottom Bar & Desktop Background
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Desktop Nav Background toggle
      setScrolled(currentScrollY > 20);

      // Mobile Bottom Nav Hide/Show Logic
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShowMobileNav(false); // Hide on scroll down
      } else {
        setShowMobileNav(true);  // Show on scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 3. Constants
  const navLinks = [
    { name: "Score",      href: "/",         icon: <BarChart3 size={20} strokeWidth={2.5} /> },
    { name: "JD Match",   href: "/optimize", icon: <ScanSearch size={20} strokeWidth={2.5} /> }, 
    { name: "Find Jobs",  href: "/jobs",     icon: <Globe2 size={20} strokeWidth={2.5} /> },
    { name: "Templates",  href: "/templates", icon: <Layers3 size={20} strokeWidth={2.5} /> },
  ];

  const userButtonAppearance = {
    baseTheme: dark,
    variables: { colorPrimary: "#00f2fe", colorBackground: "#0f1117" },
    elements: {
      avatarBox: "w-9 h-9 ring-2 ring-cyan-500/30 hover:ring-cyan-400 transition-all duration-300",
    },
  };

  // 4. Early Returns (MUST be after hooks)
  if (!mounted) return null;
  
  // ✅ If the URL starts with /r/ (shared resume), hide the navbar entirely!
  if (pathname?.startsWith("/r/")) {
    return null;
  }

  // 5. Final JSX Render
  return (
    <header>
      {/* =========================================================
          DESKTOP NAVBAR (Premium Pill with Edge Glow Light)
          ========================================================= */}
      <nav className={`hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${scrolled ? 'w-[90%] max-w-4xl' : 'w-[95%] max-w-5xl'}`}>
        <div className="w-full h-16 bg-[#05050A]/80 backdrop-blur-2xl border border-white/10 rounded-full px-8 flex items-center justify-between shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          {/* 🔴 NEW CV MONOGRAM LOGO 🔴 */}
          <Link href="/" className="flex items-center gap-1.5 z-10 group">
            <div className="relative flex items-center justify-center w-12 h-10 transition-transform duration-300 group-hover:scale-110">
              {/* Subtle Background Glow */}
              <div className="absolute inset-0 bg-cyan-500/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Overlapping 'C' and 'V' */}
              <div className="relative flex items-center justify-center font-syne font-black text-2xl tracking-tighter">
                 <span className="text-white translate-x-[4px] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">C</span>
                 <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500 -translate-x-[4px] drop-shadow-[0_0_12px_rgba(34,211,238,0.5)] mix-blend-lighten">V</span>
              </div>
            </div>
            <span className="font-syne font-extrabold text-xl text-white tracking-tight hidden lg:block ml-1">
              Vision
            </span>
          </Link>

          {/* Links with Top Edge Light Cast Effect */}
          <div className="flex h-full items-center gap-2 z-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.name} href={link.href} className="relative h-full flex items-center px-5 group">
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-white rounded-b-md transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-16 h-10 bg-gradient-to-b from-cyan-400/30 to-transparent blur-[10px] transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                  <span className={`font-inter text-sm font-semibold tracking-wide transition-colors duration-300 z-10 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-slate-400 group-hover:text-white'}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center z-10">
            <SignedOut>
              <Link href="/sign-in" className="h-9 px-5 bg-white text-black font-semibold text-sm rounded-full hover:bg-slate-200 transition-colors flex items-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" appearance={userButtonAppearance} />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* =========================================================
          MOBILE TOP BAR
          ========================================================= */}
      <div className="md:hidden fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-40 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        
        {/* 🔴 MOBILE LOGO 🔴 */}
        <Link href="/" className="flex items-center pointer-events-auto">
          <div className="relative flex items-center justify-center w-10 h-8">
            <div className="relative flex items-center justify-center font-syne font-black text-xl tracking-tighter">
               <span className="text-white translate-x-[3px]">C</span>
               <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500 -translate-x-[3px] drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">V</span>
            </div>
          </div>
          <span className="font-syne font-extrabold text-lg text-white tracking-tight ml-0.5">Vision</span>
        </Link>

        <div className="pointer-events-auto">
          <SignedOut>
            <Link href="/sign-in" className="w-9 h-9 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white">
              <User size={16} />
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={userButtonAppearance} />
          </SignedIn>
        </div>
      </div>

      {/* =========================================================
          MOBILE BOTTOM BAR (Smart Hide/Show on Scroll)
          ========================================================= */}
      <div 
        className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] h-16 bg-[#0a0a0c]/95 backdrop-blur-2xl border border-white/10 rounded-full flex justify-between items-center px-2 z-50 transition-transform duration-500 ease-in-out shadow-[0_10px_40px_rgba(0,0,0,0.8)] ${
          showMobileNav ? 'translate-y-0' : 'translate-y-[150%]'
        }`}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className="relative w-full h-full flex flex-col items-center justify-center gap-1"
            >
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-cyan-400 rounded-b-md transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-10 bg-cyan-400/20 blur-[10px] transition-opacity duration-300 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`} />
              <span className={`z-10 transition-colors duration-300 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-slate-500'}`}>
                {link.icon}
              </span>
              <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-300 z-10 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}