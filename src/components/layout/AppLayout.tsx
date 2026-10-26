import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Activity,
  Brain,
  Sparkles,
  Heart,
  Compass,
  Trees,
  TrendingUp,
  FileText,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Pause,
  ChevronDown,
  Globe,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWellness } from '../../context/WellnessContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  exact?: boolean;
  badge?: string;
}

interface DropdownGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { audioState, stopAudio } = useWellness();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGroupOpen, setMobileGroupOpen] = useState<string | null>('wellness');
  const navbarRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Escape key closes menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dropdown navigation groups organized by existing features
  const dropdownGroups: DropdownGroup[] = [
    {
      id: 'wellness',
      label: 'Wellness',
      items: [
        {
          name: 'Daily Check-in',
          path: '/app/check-in',
          icon: Activity,
          description: 'Log daily biometrics, sleep, mood & workload'
        },
        {
          name: 'Stress Monitor',
          path: '/app/stress-monitor',
          icon: Brain,
          description: 'Live cognitive & tension estimation heuristics'
        },
        {
          name: 'AI Insights',
          path: '/app/insights',
          icon: Sparkles,
          badge: 'AI',
          description: 'Personalized evidence-grounded suggestions'
        },
        {
          name: 'Wellness Studio',
          path: '/app/wellness',
          icon: Heart,
          description: 'Guided breathwork, sonic soundscapes & mindful resets'
        },
        {
          name: 'Recovery Planner',
          path: '/app/recovery-planner',
          icon: Compass,
          description: 'Context-aware dynamic recharge schedules'
        },
        {
          name: 'Health & Biometrics',
          path: '/app/health',
          icon: Stethoscope,
          description: 'Blood pressure, pulse, oxygen & home vitals'
        },
      ],
    },
    {
      id: 'explore',
      label: 'Explore',
      items: [
        {
          name: 'Sports & Movement',
          path: '/app/wellness#movement',
          icon: Activity,
          description: 'Active restoration & athletic recovery drills'
        },
        {
          name: 'Nature Escapes',
          path: '/app/travel',
          icon: Trees,
          description: 'Biophilic sanctuaries & forest-bathing destinations'
        },
        {
          name: 'Travel & Retreats',
          path: '/app/travel#retreats',
          icon: Compass,
          description: 'TinyFish verified mindful retreats & wellness hubs'
        },
      ],
    },
    {
      id: 'progress',
      label: 'Progress',
      items: [
        {
          name: 'Progress & Trends',
          path: '/app/progress',
          icon: TrendingUp,
          description: 'Multi-day stress baselines & recovery consistency'
        },
        {
          name: 'Weekly & Monthly Reports',
          path: '/app/reports',
          icon: FileText,
          description: 'Comprehensive wellness summaries & clinical-grade exports'
        },
      ],
    },
  ];

  const handleSignOut = async () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    await logout();
    navigate('/', { replace: true });
  };

  const isLinkActive = (item: NavItem) => {
    if (item.path.includes('#')) {
      const [path, hash] = item.path.split('#');
      return location.pathname === path && location.hash === `#${hash}`;
    }
    if (item.exact) {
      return location.pathname === item.path && !location.hash;
    }
    return location.pathname === item.path && !location.hash;
  };

  const isGroupActive = (group: DropdownGroup) => {
    return group.items.some((item) => isLinkActive(item));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F0E8] text-[#292B26]">
      {/* ==================================================================== */}
      {/* SHARED AUTHENTICATED TOP NAVBAR                                      */}
      {/* ==================================================================== */}
      <header
        ref={navbarRef}
        className="sticky top-0 z-40 w-full border-b border-[#E4DED2] bg-[#FBF9F4]/90 backdrop-blur-md transition-all shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 1. LEFT: Brand Wordmark (Navigates to /app) */}
            <div className="flex items-center gap-6 shrink-0">
              <Link
                to="/app"
                className="flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-[#34483A] rounded-xl px-1 py-0.5"
                title="Psygma Authenticated Dashboard"
              >
                <div className="w-8 h-8 rounded-full bg-[#34483A] text-[#FBF9F4] flex items-center justify-center font-serif text-base font-bold shadow-xs group-hover:bg-[#25352A] transition-colors">
                  Ψ
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg tracking-[0.16em] font-semibold text-[#292B26] leading-none">
                    PSYGMA
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-[#77766D] mt-0.5 hidden sm:block">
                    Wellness Intelligence
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. CENTER: Dropdown Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {/* Direct Dashboard Link */}
              <Link
                to="/app"
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/app' && !location.hash
                    ? 'bg-[#E9E5D9] text-[#34483A] font-semibold'
                    : 'text-[#77766D] hover:bg-[#F4F0E8] hover:text-[#292B26]'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              {/* Feature Dropdowns */}
              {dropdownGroups.map((group) => {
                const isOpen = activeDropdown === group.id;
                const active = isGroupActive(group);

                return (
                  <div key={group.id} className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isOpen ? null : group.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isOpen || active
                          ? 'bg-[#E9E5D9] text-[#34483A] font-semibold'
                          : 'text-[#77766D] hover:bg-[#F4F0E8] hover:text-[#292B26]'
                      }`}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                    >
                      <span>{group.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#34483A]' : 'text-[#77766D]'
                        }`}
                      />
                    </button>

                    {/* Desktop Dropdown Panel */}
                    {isOpen && (
                      <div
                        role="menu"
                        className="absolute left-0 mt-2 w-72 bg-[#FBF9F4] border border-[#E4DED2] rounded-2xl shadow-xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
                      >
                        <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#77766D]/80 border-b border-[#E4DED2] mb-1">
                          {group.label} Features
                        </div>
                        <div className="space-y-0.5">
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            const itemActive = isLinkActive(item);

                            return (
                              <Link
                                key={item.name}
                                to={item.path}
                                role="menuitem"
                                onClick={() => setActiveDropdown(null)}
                                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                                  itemActive
                                    ? 'bg-[#E9E5D9] text-[#34483A] font-semibold'
                                    : 'text-[#292B26] hover:bg-[#F4F0E8]'
                                }`}
                              >
                                <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                                  itemActive ? 'bg-[#34483A] text-[#FBF9F4]' : 'bg-[#E9E5D9] text-[#34483A]'
                                }`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-medium truncate">{item.name}</span>
                                    {item.badge && (
                                      <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#A6B59A]/30 text-[#34483A]">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="text-[11px] text-[#77766D] font-normal leading-snug line-clamp-1 mt-0.5">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* 3. RIGHT: Audio Status, Quick Check-in & Profile Menu */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Audio Widget Mini Pill (Preserved active state) */}
              {audioState.isPlaying && (
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#E9E5D9]/90 border border-[#D7C5AC] text-xs font-medium text-[#34483A]">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-3 bg-[#34483A] animate-pulse"></span>
                    <span className="w-0.5 h-2 bg-[#34483A] animate-pulse delay-75"></span>
                    <span className="w-0.5 h-2.5 bg-[#34483A] animate-pulse delay-150"></span>
                  </div>
                  <span className="hidden md:inline truncate max-w-[110px] text-[11px]">
                    {audioState.trackName}
                  </span>
                  <button
                    onClick={stopAudio}
                    className="p-0.5 hover:bg-[#D7C5AC] rounded-full transition-colors cursor-pointer"
                    title="Pause Audio"
                    aria-label="Pause audio"
                  >
                    <Pause className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Quick Check-in Button */}
              <Link
                to="/app/check-in"
                className="pill-button-primary text-xs py-1.5 px-3 sm:px-3.5 shadow-xs flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Daily Check-In</span>
                <span className="sm:hidden">Check In</span>
              </Link>

              {/* Profile / Account Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#E9E5D9] transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#34483A]"
                  aria-label="User account menu"
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === 'profile'}
                >
                  <div className="w-8 h-8 rounded-full bg-[#D7C5AC]/50 border border-[#E4DED2] flex items-center justify-center text-[#34483A] font-semibold text-xs overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#77766D] hidden sm:block" />
                </button>

                {activeDropdown === 'profile' && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 bg-[#FBF9F4] border border-[#E4DED2] rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    {/* User Identity Header */}
                    <div className="px-3.5 py-2.5 border-b border-[#E4DED2] bg-[#F4F0E8]/50">
                      <div className="font-semibold text-[#292B26] truncate">{user.name}</div>
                      <div className="text-[10px] text-[#77766D] truncate mt-0.5">{user.email}</div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/app/profile"
                        role="menuitem"
                        onClick={() => setActiveDropdown(null)}
                        className={`flex items-center gap-2.5 px-3.5 py-2 transition-colors ${
                          location.pathname === '/app/profile'
                            ? 'bg-[#E9E5D9] text-[#34483A] font-semibold'
                            : 'text-[#292B26] hover:bg-[#F4F0E8]'
                        }`}
                      >
                        <User className="w-3.5 h-3.5 text-[#77766D]" />
                        <span>Profile & Preferences</span>
                      </Link>

                      <Link
                        to="/app/settings"
                        role="menuitem"
                        onClick={() => setActiveDropdown(null)}
                        className={`flex items-center gap-2.5 px-3.5 py-2 transition-colors ${
                          location.pathname === '/app/settings'
                            ? 'bg-[#E9E5D9] text-[#34483A] font-semibold'
                            : 'text-[#292B26] hover:bg-[#F4F0E8]'
                        }`}
                      >
                        <Settings className="w-3.5 h-3.5 text-[#77766D]" />
                        <span>Settings</span>
                      </Link>

                      <Link
                        to="/"
                        role="menuitem"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-[#77766D] hover:bg-[#F4F0E8] hover:text-[#292B26] transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#77766D]" />
                        <span>Public Website</span>
                      </Link>
                    </div>

                    <div className="border-t border-[#E4DED2] my-1"></div>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-700" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#292B26] hover:bg-[#E9E5D9] focus:outline-hidden focus:ring-2 focus:ring-[#34483A]"
                aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* RESPONSIVE MOBILE TOP NAVIGATION PANEL                              */}
        {/* ==================================================================== */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E4DED2] bg-[#FBF9F4] shadow-xl px-4 py-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
            {/* Overview / Dashboard */}
            <Link
              to="/app"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium ${
                location.pathname === '/app' && !location.hash
                  ? 'bg-[#E9E5D9] text-[#34483A] font-semibold'
                  : 'text-[#292B26] hover:bg-[#F4F0E8]'
              }`}
            >
              <Home className="w-4 h-4 text-[#34483A]" />
              <span>Dashboard Overview</span>
            </Link>

            {/* Feature Accordion Groups */}
            {dropdownGroups.map((group) => {
              const isGroupExpanded = mobileGroupOpen === group.id;

              return (
                <div key={group.id} className="border border-[#E4DED2] rounded-2xl overflow-hidden bg-white/40">
                  <button
                    type="button"
                    onClick={() => setMobileGroupOpen(isGroupExpanded ? null : group.id)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-[#34483A] hover:bg-[#F4F0E8] transition-colors"
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isGroupExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isGroupExpanded && (
                    <div className="p-2 space-y-1 bg-[#FBF9F4] border-t border-[#E4DED2]">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const active = isLinkActive(item);

                        return (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                              active
                                ? 'bg-[#E9E5D9] text-[#34483A] font-semibold'
                                : 'text-[#77766D] hover:bg-[#F4F0E8] text-[#292B26]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-3.5 h-3.5 text-[#34483A]" />
                              <span>{item.name}</span>
                            </div>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-[#A6B59A]/30 text-[#34483A]">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Mobile User Profile & Logout Area */}
            <div className="pt-3 border-t border-[#E4DED2] space-y-2">
              <Link
                to="/app/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#292B26] hover:bg-[#F4F0E8] rounded-xl"
              >
                <User className="w-4 h-4 text-[#77766D]" />
                <span>Profile & Preferences</span>
              </Link>

              <Link
                to="/app/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#292B26] hover:bg-[#F4F0E8] rounded-xl"
              >
                <Settings className="w-4 h-4 text-[#77766D]" />
                <span>Settings</span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-rose-700" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ==================================================================== */}
      {/* MAIN VIEW AREA (NO SIDEBAR - NATURAL FULL WIDTH)                     */}
      {/* ==================================================================== */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
