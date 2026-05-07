'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
  slug: string;
  children?: Category[];
}

const MENU_STRUCTURE = [
  { label: 'PROGRAMAÇÃO WEB', slug: 'programacao-web' },
  { label: 'PROGRAMAÇÃO', slug: 'algoritmo-linguagem-de-programacao' },
  { label: 'PLATAFORMAS DE IA', slug: 'plataformas-de-ia' },
  { label: 'BIG DATA / IA', slug: 'big-data' },
  { label: 'GAMES', slug: 'criando-games' },
  { label: 'DEVOPS', slug: 'devops' },
  { label: 'NOTÍCIAS', slug: 'noticias-sobre-tecnologia' },
  { label: 'SOBRE', slug: 'sobre' }
];

const SUBMENU_ORDER: Record<string, string[]> = {
  'PROGRAMAÇÃO WEB': ['React', 'Golang para web', 'Django', 'Nextjs'],
  'Golang para web': ['Go - App Web com Redis', 'Fiber'],
  'Django': ['App Polls', 'Loja virtual - Ecommerce'],
  'PROGRAMAÇÃO': ['Computação Quântica', 'Análise e Complexidade de Algoritmos', 'Python', 'R', 'C', 'Go', 'Javascript'],
  'Javascript': ['Fundamentos do javascript', 'Web Audio API com Javascript', 'React Native'],
  'BIG DATA / IA': ['Disrupções Tecnológicas', 'Tutorial Hadoop', 'Data Science com R', 'Certificação Hortonworks Hadoop', 'Aprendizado de Máquina - Machine Learning'],
  'Aprendizado de Máquina - Machine Learning': ['Sistemas Multi-Agentes', 'Python - Scikit-Learn', 'Python - TensorFlow - Keras - Redes Neurais', 'Python - Pacote Face Recognition'],
  'GAMES': ['Games em python'],
  'DEVOPS': ['Conceito de DevOps', 'Curso de Git', 'Docker', 'Kubernates']
};

export default function Navbar({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const sortSubcategories = (cats: Category[], parentLabel: string) => {
    const order = SUBMENU_ORDER[parentLabel];
    if (!order) return cats.sort((a, b) => a.name.localeCompare(b.name));

    return [...cats].sort((a, b) => {
      const indexA = order.findIndex(name => a.name.includes(name) || name.includes(a.name));
      const indexB = order.findIndex(name => b.name.includes(name) || name.includes(b.name));
      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  // Strictly filter and build menu items based on MENU_STRUCTURE
  const menuItems = MENU_STRUCTURE.map(item => {
    if (item.slug === 'sobre') {
      return {
        _id: 'sobre-link',
        name: 'SOBRE',
        slug: 'sobre',
        children: []
      };
    }

    const category = categories.find(c => c.slug.toLowerCase() === item.slug.toLowerCase());
    if (!category) return null;

    // Build children and sub-children
    const children = category.children ? sortSubcategories(category.children, item.label).map(child => ({
      ...child,
      children: child.children ? sortSubcategories(child.children, child.name) : []
    })) : [];

    return {
      ...category,
      name: item.label, // Use the forced label
      children
    };
  }).filter(Boolean) as Category[];

  // Helper for rendering dropdown items
  const DropdownItem = ({ cat, isSubmenu = false }: { cat: Category, isSubmenu?: boolean }) => {
    const hasChildren = cat.children && cat.children.length > 0;
    
    return (
      <div className={`relative group/sub ${isSubmenu ? 'w-full' : ''}`}>
        <Link
          href={`/${cat.slug}`}
          className={`flex items-center justify-between px-4 py-3 text-[13px] text-gray-300 hover:text-neon-cyan hover:bg-white/5 transition-colors duration-200 ${isSubmenu ? 'pl-4' : ''}`}
        >
          <span>{cat.name}</span>
          {hasChildren && (
            <svg className="ml-2 w-4 h-4 transform -rotate-90 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 9l-7 7-7-7" />
            </svg>
          )}
        </Link>
        
        {hasChildren && (
          <div className="absolute left-full top-0 ml-0 w-72 bg-[#111111] border border-[#222222] rounded shadow-2xl py-1 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 z-[60]">
            {cat.children!.map(child => (
              <DropdownItem key={child._id} cat={child} isSubmenu={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[140px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image 
                src="https://pub-7deede0db74e4001bd7334a7b1a70353.r2.dev/code-upscale-relevo-01.png"
                alt="Código Fluente"
                width={120}
                height={120}
                priority
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:block">
            <div className="flex items-center space-x-1">
              {menuItems.map((cat) => (
                <div key={cat._id} className="relative group">
                  <Link
                    href={cat.slug === 'sobre' ? '/sobre' : `/${cat.slug}`}
                    className="text-white hover:text-neon-cyan px-4 py-2 rounded-md text-[13px] font-bold tracking-wide transition-colors duration-200 flex items-center uppercase"
                  >
                    {cat.name}
                    {cat.children && cat.children.length > 0 && (
                      <svg className="ml-1.5 w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {cat.children && cat.children.length > 0 && (
                    <div className="absolute left-0 mt-0 w-72 bg-[#111111] border border-[#222222] rounded shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {cat.children.map((child) => (
                        <DropdownItem key={child._id} cat={child} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-neon-cyan focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`xl:hidden ${isOpen ? 'block' : 'hidden'} bg-[#0a0a0a] border-t border-white/10 max-h-[calc(100vh-140px)] overflow-y-auto`}>
        <div className="px-4 py-6 space-y-4">
          {menuItems.map((cat) => (
            <div key={cat._id} className="border-b border-white/5 pb-4">
              <Link
                href={cat.slug === 'sobre' ? '/sobre' : `/${cat.slug}`}
                className="block text-white font-bold text-base uppercase hover:text-neon-cyan py-2"
                onClick={() => setIsOpen(false)}
              >
                {cat.name}
              </Link>
              {cat.children && cat.children.length > 0 && (
                <div className="pl-4 space-y-3 mt-2">
                  {cat.children.map((child) => (
                    <div key={child._id}>
                      <Link
                        href={`/${child.slug}`}
                        className="block text-gray-300 text-sm hover:text-neon-cyan py-1"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.name}
                      </Link>
                      {child.children && child.children.length > 0 && (
                        <div className="pl-4 space-y-2 mt-2 border-l border-white/10">
                          {child.children.map((subChild) => (
                            <Link
                              key={subChild._id}
                              href={`/${subChild.slug}`}
                              className="block text-gray-400 text-[13px] hover:text-neon-cyan py-1"
                              onClick={() => setIsOpen(false)}
                            >
                              {subChild.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
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
