import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../navigation/Navbar';
import { Footer } from '../navigation/Footer';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F0E8] text-[#292B26] font-sans antialiased">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
