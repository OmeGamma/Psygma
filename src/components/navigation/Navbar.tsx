import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ChevronDown,
  Activity,
  Brain,
  Compass,
  Wind,
  Music,
  Trees,
  Shield,
  FileText,
  Mail,
  User,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  MapPin,
  Heart,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DropdownItem {
  name: string;
  desc: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  isNew?: boolean;
}

const NAV_GROUPS: Record<string, DropdownItem[]> = {
  Discover: [
    {
      name: 'Explore Psygma',
      desc: 'An overview of our mindful stress intelligence ecosystem',
      path: '/#explore',
      icon: Compass
    },
    {
      name: 'How It Works',
      desc: 'The 6-stage input-to-action biometric intelligence pipeline',
      path: '/how-it-works',
      icon: Brain
    },
    {
      name: 'Research & Safety',
      desc: 'Our clinical advisory framework and non-diagnostic principles',
      path: '/about#research',
      icon: Shield
    },
    {
      name: 'FAQs',
      desc: 'Frequently asked questions regarding methodology and privacy',
      path: '/how-it-works#faq',
      icon: FileText
    }
  ],
  Intelligence: [
    {
      name: 'Stress Monitor',
      desc: '7, 30 & 90-day historical views distinguishing models from reported data',
      path: '/app/stress-monitor',
      icon: Activity
    },
    {
      name: 'AI Insights',
      desc: 'Grounded observations, contributing factors & recommendation feedback',
      path: '/app/insights',
      icon: Sparkles,
      isNew: true
    },
    {
      name: 'Personal Wellness Profile',
      desc: 'Calibrate baselines, target sleep windows & sensory interests',
      path: '/app/profile',
      icon: User
    },
    {
      name: 'Patterns & Trends',
      desc: 'Sleep vs energy correlations, check-in streaks & milestone tracking',
      path: '/app/progress',
      icon: TrendingUp
    },
    {
      name: 'Reports',
      desc: 'Downloadable & printable weekly/monthly intelligence summaries',
      path: '/app/reports',
      icon: FileText
    }
  ],
  Wellness: [
    {
      name: 'Wellness Studio',
      desc: 'Functional breathing, meditation timers and restorative audio suites',
      path: '/wellness',
      icon: Heart
    },
    {
      name: 'Breathing & Meditation',
      desc: 'Paced Box (4-4-4-4) and 4-7-8 relaxing breath with audio cues',
      path: '/wellness#breathing',
      icon: Wind
    },
    {
      name: 'Mindful Audio',
      desc: 'Sacred Om, soulful Bansuri flute, monsoon rain & temple singing bowls',
      path: '/wellness#audio',
      icon: Music
    },
    {
      name: 'Sports & Movement',
      desc: 'Casual badminton, park bageecha walks and gentle stretching',
      path: '/wellness#movement',
      icon: Activity
    },
    {
      name: 'Nature Escapes',
      desc: 'Peaceful tea estates, river retreats and green nature sanctuaries',
      path: '/travel',
      icon: Trees
    },
    {
      name: 'Travel & Retreats',
      desc: 'Verified wellness sanctuaries integrated with TinyFish discovery',
      path: '/travel#retreats',
      icon: MapPin,
      isNew: true
    },
    {
      name: 'Daily Routines',
      desc: 'Structured morning, afternoon and wind-down micro-habits',
      path: '/wellness#routines',
      icon: Compass
    }
  ],
  About: [
    {
      name: 'Our Mission',
      desc: 'Why Team OmeGamma engineered Psygma for compassionate wellness',
      path: '/about',
      icon: Heart
    },
    {
      name: 'Technology',
      desc: 'Edge-oriented modeling, privacy-first machine learning & architecture',
      path: '/about#technology',
      icon: Brain
    },
    {
      name: 'Privacy & Security',
      desc: 'Zero-ad policy, user-owned records, data export and instant purge',
      path: '/privacy',
      icon: Shield
    },
    {
      name: 'Responsible AI',
      desc: 'Transparent confidence bounds, ethical disclosures & safety limits',
      path: '/about#responsible-ai',
      icon: Sparkles
    },
    {
      name: 'Contact',
      desc: 'Connect with Team OmeGamma research and engineering',
      path: '/contact',
      icon: Mail
    }
  ]
};

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenGroup(null);
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setOpenGroup(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleGroup = (groupName: string) => {
    setOpenGroup(prev => (prev === groupName ? null : groupName));
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 bg-[#FBF9F4]/95 backdrop-blur-md text-[#292B26] border-b border-[#E4DED2] shadow-xs py-3.5 transition-colors"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#34483A] rounded-lg"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs bg-[#34483A] text-[#FBF9F4]">
              <span className="font-serif text-lg font-bold">Ψ</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl sm:text-3xl font-serif tracking-[0.2em] font-semibold leading-none text-[#292B26]">
                PSYGMA
              </span>
              <span className="text-[9px] uppercase tracking-[0.28em] font-medium leading-tight mt-1 text-[#77766D]">
                By OmeGamma
              </span>
            </div>
          </Link>

          {/* Desktop Nav Groups */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {Object.entries(NAV_GROUPS).map(([groupName, items]) => {
              const isOpen = openGroup === groupName;
              return (
                <div key={groupName} className="relative">
                  <button
                    onClick={() => toggleGroup(groupName)}
                    onMouseEnter={() => setOpenGroup(groupName)}
                    aria-expanded={isOpen}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#34483A] ${
                      isOpen
                        ? 'bg-[#E9E5D9] text-[#292B26]'
                        : 'text-[#292B26] hover:text-[#34483A] hover:bg-[#F4F0E8]'
                    }`}
                  >
                    <span>{groupName}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Desktop Dropdown Menu */}
                  {isOpen && (
                    <div
                      onMouseLeave={() => setOpenGroup(null)}
                      className="absolute top-full left-0 mt-2 w-84 bg-[#FBF9F4] text-[#292B26] rounded-2xl shadow-xl border border-[#E4DED2] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#77766D] border-b border-[#E4DED2]/60 flex items-center justify-between">
                        <span>{groupName}</span>
                        <span className="text-[10px] text-[#A6B59A]">Psygma Platform</span>
                      </div>
                      <div className="py-1">
                        {items.map(item => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              to={item.path}
                              onClick={() => setOpenGroup(null)}
                              className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4F0E8] transition-colors duration-150 focus:outline-none focus:bg-[#F4F0E8]"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#E9E5D9] group-hover:bg-[#34483A] group-hover:text-white text-[#34483A] flex items-center justify-center shrink-0 transition-colors mt-0.5">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-[#292B26] group-hover:text-[#34483A] transition-colors">
                                    {item.name}
                                  </span>
                                  {item.isNew && (
                                    <span className="bg-[#A6B59A]/30 text-[#34483A] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                      New
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#77766D] line-clamp-1 mt-0.5">
                                  {item.desc}
                                </p>
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

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/app"
                  className="pill-button-primary text-sm py-2 px-4.5 shadow-sm flex items-center gap-1.5 transition-transform hover:scale-102"
                >
                  <Activity className="w-4 h-4" />
                  <span>Open App</span>
                </Link>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#E4DED2] text-[#292B26] hover:bg-[#E9E5D9] transition-all overflow-hidden shadow-xs hover:scale-105"
                    title={user.name}
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </button>

                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-[#FBF9F4] text-[#292B26] rounded-2xl shadow-xl border border-[#E4DED2] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-2 border-b border-[#E4DED2]/60">
                        <div className="text-xs font-semibold text-[#292B26] truncate">{user.name}</div>
                        <div className="text-[10px] text-[#77766D] truncate">{user.email}</div>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/app"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-[#F4F0E8] text-[#292B26]"
                        >
                          <Activity className="w-3.5 h-3.5 text-[#34483A]" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/app/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-[#F4F0E8] text-[#292B26]"
                        >
                          <User className="w-3.5 h-3.5 text-[#34483A]" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/app/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-[#F4F0E8] text-[#292B26]"
                        >
                          <Settings className="w-3.5 h-3.5 text-[#34483A]" />
                          <span>Settings</span>
                        </Link>
                      </div>
                      <div className="pt-1 border-t border-[#E4DED2]/60">
                        <button
                          onClick={async () => {
                            await logout();
                            setUserMenuOpen(false);
                            navigate('/', { replace: true });
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium px-4 py-2 rounded-full text-[#292B26] hover:text-[#34483A] hover:bg-[#F4F0E8] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="pill-button text-sm py-2.5 px-6 font-semibold transition-all shadow-md bg-[#34483A] text-[#FBF9F4] hover:bg-[#26352b] flex items-center gap-1.5"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#292B26] hover:bg-[#E9E5D9] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-[#FBF9F4] text-[#292B26] border-b border-[#E4DED2] shadow-2xl max-h-[85vh] overflow-y-auto px-4 py-6 z-50">
          <div className="space-y-4">
            {Object.entries(NAV_GROUPS).map(([groupName, items]) => {
              const isExpanded = mobileExpandedGroup === groupName;
              return (
                <div key={groupName} className="border-b border-[#E4DED2]/60 pb-3">
                  <button
                    onClick={() => setMobileExpandedGroup(isExpanded ? null : groupName)}
                    className="w-full flex items-center justify-between text-left py-2 font-serif text-lg font-medium text-[#292B26]"
                  >
                    <span>{groupName}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#77766D] transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="mt-2 space-y-2 pl-2">
                      {items.map(item => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#F4F0E8] transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#E9E5D9] text-[#34483A] flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#292B26]">{item.name}</div>
                              <div className="text-xs text-[#77766D]">{item.desc}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-4 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/app"
                    onClick={() => setMobileMenuOpen(false)}
                    className="pill-button-primary w-full text-center"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/app/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="pill-button-secondary w-full text-center"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      setMobileMenuOpen(false);
                      navigate('/', { replace: true });
                    }}
                    className="w-full py-2.5 px-4 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="pill-button-primary w-full text-center"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="pill-button-secondary w-full text-center"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
