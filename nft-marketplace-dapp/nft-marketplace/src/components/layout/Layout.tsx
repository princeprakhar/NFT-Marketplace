// src/components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import Navbar from '../common/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <p className="text-center">© {new Date().getFullYear()} NFT Marketplace. All rights reserved.</p>
        </div>
      </footer>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Layout;