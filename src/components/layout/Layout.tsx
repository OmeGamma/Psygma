import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Compass, Activity, User, Leaf, MessageCircle, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Wellness', path: '/wellness', icon: Activity },
    { name: 'Coach', path: '/coach', icon: MessageCircle },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-psygma-bg overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-card m-4 flex flex-col justify-between py-8">
        <div>
          <div className="px-8 mb-12 flex items-center gap-2 text-psygma-earth">
            <Leaf className="w-8 h-8" />
            <h1 className="text-2xl font-serif font-semibold tracking-wide">PSYGMA</h1>
          </div>
          
          <nav className="flex flex-col gap-2 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300',
                    isActive 
                      ? 'bg-white/50 text-psygma-earth shadow-sm' 
                      : 'text-psygma-muted hover:bg-white/30 hover:text-psygma-text'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="px-8">
          <Link to="/check-in" className="pill-button-primary w-full py-2.5 text-sm shadow-md">
            Check-in Now
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 relative z-10">
        <div className="max-w-6xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
