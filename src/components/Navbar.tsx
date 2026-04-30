'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
  slug: string;
  children: Category[];
}

export default function Navbar({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-neon-pink tracking-tighter">
                <span className="text-neon-cyan">01</span>CODIGO<span className="text-neon-cyan">FLUENTE</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {categories.map((cat) => (
                <div key={cat._id} className="relative group">
                  {cat.children && cat.children.length > 0 ? (
                    <button
                      className="text-gray-300 hover:text-neon-cyan px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                      onMouseEnter={() => setActiveDropdown(cat._id)}
                    >
                      {cat.name}
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={`/${cat.slug}`}
                      className="text-gray-300 hover:text-neon-cyan px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      {cat.name}
                    </Link>
                  )}

                  {cat.children && cat.children.length > 0 && (
                    <div 
                      className={`absolute left-0 mt-0 w-56 bg-background border border-white/10 rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}
                    >
                      {cat.children.map((child) => (
                        <Link
                          key={child._id}
                          href={`/${child.slug}`}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-neon-pink/10 hover:text-neon-pink"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-neon-pink hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-background/95 border-b border-white/10`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {categories.map((cat) => (
            <div key={cat._id}>
              <div className="flex justify-between items-center px-3 py-2 text-base font-medium text-gray-300">
                <Link href={`/${cat.slug}`} onClick={() => setIsOpen(false)}>
                  {cat.name}
                </Link>
                {cat.children && cat.children.length > 0 && (
                  <button onClick={() => setActiveDropdown(activeDropdown === cat._id ? null : cat._id)}>
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === cat._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
              {cat.children && cat.children.length > 0 && activeDropdown === cat._id && (
                <div className="pl-6 space-y-1">
                  {cat.children.map((child) => (
                    <Link
                      key={child._id}
                      href={`/${child.slug}`}
                      className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-neon-pink"
                      onClick={() => setIsOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
