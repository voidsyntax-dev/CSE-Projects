"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-8 overflow-x-auto no-scrollbar py-1">
      <Link href="/" className="hover:text-blue-600 transition-colors shrink-0">
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2 shrink-0">
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-blue-600 transition-colors"
            >
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.label}
              </motion.span>
            </Link>
          ) : (
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-zinc-900 dark:text-zinc-100"
            >
              {item.label}
            </motion.span>
          )}
        </div>
      ))}
    </nav>
  );
}
