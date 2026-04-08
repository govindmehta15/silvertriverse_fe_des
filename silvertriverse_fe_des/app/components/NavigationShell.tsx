'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ), color: 'var(--color-accent-reelity)' },
  { name: 'Collectibles', href: '/cu', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
  ), color: 'var(--color-accent-cu)' },
  { name: 'Merch', href: '/merchandise', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
  ), color: 'var(--color-accent-merch)' },
  { name: 'World', href: '/land', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
  ), color: '#ffffff' },
  { name: 'Profile', href: '/profile', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ), color: '#ffffff' },
];

export default function NavigationShell() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] p-4 pb-8 pointer-events-none md:pointer-events-auto md:relative md:bottom-auto md:left-auto md:right-auto md:flex md:w-32 md:flex-shrink-0 md:flex-col md:p-6 lg:w-40">
      <div className="mx-auto flex h-20 max-w-lg items-center justify-around rounded-[32px] luxury-glass px-4 pointer-events-auto md:h-full md:w-full md:max-w-none md:flex-col md:justify-start md:gap-10 md:px-0 md:py-10 border border-gold/20 shadow-2xl">
        
        {/* Ornate Brand Node */}
        <div className="hidden md:flex h-16 w-16 luxury-glass border-gold/40 items-center justify-center rounded-2xl gold-text text-3xl font-black serif italic cursor-default select-none mb-10 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
           ST
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex flex-col items-center justify-center p-2 transition-all duration-500 ${
                isActive ? 'scale-110' : 'opacity-40 hover:opacity-100 hover:scale-105'
              }`}
            >
              <div 
                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 ${
                  isActive ? 'bg-gold/10 shadow-[inset_0_0_15px_rgba(212,175,55,0.1)]' : 'hover:bg-white/5'
                }`}
                style={{ color: isActive ? 'var(--gold)' : 'var(--color-silk)' }}
              >
                {item.icon}
              </div>
              <span 
                className={`mt-2 text-[8px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                  isActive ? 'opacity-100 translate-y-0 text-gold' : 'opacity-0 translate-y-2 text-center'
                }`}
              >
                {item.name}
              </span>
              
              {isActive && (
                <div 
                  className="absolute -top-4 md:-left-3 md:top-auto md:bottom-auto h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_15px_var(--gold)] md:h-4 md:w-[2px]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
