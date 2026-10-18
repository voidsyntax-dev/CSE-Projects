"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  session: any;
  signOutAction: () => Promise<void>;
}

export default function MobileMenu({ session, signOutAction }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Careers", href: "/careers" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Portfolio", href: "/proofs" },
    { name: "Internships", href: "/internships" },
    { name: "AI Mentor", href: "/ai-navigator" },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 text-zinc-600 dark:text-zinc-400 focus:outline-none"
        aria-label="Toggle Menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-3/4 max-w-sm bg-white dark:bg-zinc-900 shadow-2xl p-6"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-bold text-xl text-blue-600 dark:text-blue-500">Menu</span>
                  <button onClick={toggleMenu} className="p-2 text-zinc-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={toggleMenu}
                      className={`px-4 py-3 rounded-2xl font-bold flex items-center justify-between transition-all ${
                        pathname === link.href
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  {session?.user ? (
                    <div className="space-y-4">
                      <div className="px-4">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Logged in as</p>
                        <p className="font-bold dark:text-zinc-100">{session.user.name}</p>
                      </div>
                      <button
                        onClick={async () => {
                           await signOutAction();
                           toggleMenu();
                        }}
                        className="w-full px-4 py-3 rounded-2xl bg-red-50 text-red-600 font-bold text-sm dark:bg-red-900/10 dark:text-red-400 transition-all hover:bg-red-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={toggleMenu}
                      className="block w-full px-4 py-4 rounded-2xl bg-blue-600 text-white text-center font-bold shadow-lg"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
