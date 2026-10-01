'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LayoutContextType {
  isNavExpanded: boolean;
  toggleNav: () => void;
  isDrawerOpen: boolean;
  drawerTitle: string;
  drawerContent: ReactNode | null;
  openDrawer: (title: string, content: ReactNode) => void;
  closeDrawer: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isNavExpanded, setIsNavExpanded] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerTitle, setDrawerTitle] = useState<string>('');
  const [drawerContent, setDrawerContent] = useState<ReactNode | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const toggleNav = () => setIsNavExpanded((prev) => !prev);

  const openDrawer = (title: string, content: ReactNode) => {
    setDrawerTitle(title);
    setDrawerContent(content);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setDrawerTitle('');
      setDrawerContent(null);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        else if (isDrawerOpen) closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isDrawerOpen]);

  return (
    <LayoutContext.Provider
      value={{
        isNavExpanded,
        toggleNav,
        isDrawerOpen,
        drawerTitle,
        drawerContent,
        openDrawer,
        closeDrawer,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout(): LayoutContextType {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within a LayoutProvider');
  return context;
}
