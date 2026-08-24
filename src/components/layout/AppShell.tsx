import React from 'react';
import { Navbar } from './Navbar';

export const AppShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow p-4">{children}</main>
    <footer className="p-4 border-t border-border text-center text-sm">© 2026 BorrowBox</footer>
  </div>
);
