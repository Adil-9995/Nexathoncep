import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Coins, 
  LayoutDashboard, 
  ShieldCheck, 
  Bell, 
  ChevronDown, 
  LogOut, 
  Sparkles,
  Menu,
  X,
  Plus,
  Repeat,
  UserCheck,
  PenTool
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { 
    currentUser, 
    allUsers, 
    switchUserById, 
    notifications, 
    markNotificationRead,
    setFakePaymentModalOpen,
    setPendingUnlockTeacherId
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  // Clean, focused navigation links with full and short labels for seamless responsiveness
  const navLinks = [
    { id: 'home', label: 'Home', shortLabel: 'Home', icon: Repeat },
    { id: 'learn', label: 'Explore Skills', shortLabel: 'Skills', icon: GraduationCap },
    { id: 'marketplace', label: 'Book Marketplace', shortLabel: 'Marketplace', icon: BookOpen },
    { id: 'writing', label: 'Writing Gigs', shortLabel: 'Writing', icon: PenTool, badge: 'Escrow' },
    { id: 'credits', label: 'Credit Wallet', shortLabel: 'Wallet', icon: Coins },
  ];

  if (currentUser.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Admin', shortLabel: 'Admin', icon: ShieldCheck });
  }

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Backdrop for open dropdowns */}
      {(userDropdownOpen || notifDropdownOpen) && (
        <div 
          className="fixed inset-0 z-30 bg-black/5" 
          onClick={() => {
            setUserDropdownOpen(false);
            setNotifDropdownOpen(false);
          }} 
        />
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 lg:gap-6">
            
            {/* Logo & Brand (shrink-0, vertically centered) */}
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-800 flex items-center justify-center text-white shadow-md shadow-purple-900/15 group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-5 h-5 text-amber-300" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-heading font-black text-xl text-slate-900 tracking-tight">
                    Campus<span className="text-purple-700">Loop</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200/60 leading-none">
                    Campus
                  </span>
                </div>
                <p className="hidden 2xl:block text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 leading-tight">
                  Learn One Skill. Teach Another.
                </p>
              </div>
            </div>

            {/* Desktop Navigation (Segmented Pill Bar, Centered, No 1px jumps) */}
            <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70 shadow-xs">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`h-9 px-2.5 lg:px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 lg:gap-2 whitespace-nowrap cursor-pointer border ${
                      isActive 
                        ? 'bg-white text-purple-900 shadow-sm border-purple-200/80 font-extrabold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ${isActive ? 'text-purple-700' : 'text-slate-400'}`} />
                    <span className="hidden xl:inline">{item.label}</span>
                    <span className="xl:hidden">{item.shortLabel}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs shrink-0 leading-none">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Header Controls (Uniform h-9 height, perfectly aligned) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              
              {/* Interactive Wallet Credits Pill */}
              <button
                onClick={() => setCurrentTab('credits')}
                className="h-9 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/90 text-amber-950 font-bold text-xs border border-amber-300/80 shadow-xs inline-flex items-center gap-1.5 transition-all cursor-pointer group shrink-0"
                title="Your Learning Credits balance. Click to view credit wallet."
              >
                <Coins className="w-4 h-4 text-amber-500 fill-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
                <span className="font-extrabold whitespace-nowrap">{currentUser.credits}</span>
                <span className="hidden sm:inline font-semibold text-amber-900/80 text-[11px]">Credits</span>
              </button>

              {/* Quick Top-up Button */}
              <button
                onClick={() => {
                  setPendingUnlockTeacherId(null);
                  setFakePaymentModalOpen(true);
                }}
                className="hidden sm:inline-flex items-center justify-center gap-1 h-9 px-2.5 lg:px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200/70 transition-all cursor-pointer shrink-0"
                title="Add Credits"
              >
                <Plus className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <span>Top-Up</span>
              </button>

              {/* Notifications Dropdown */}
              <div className="relative shrink-0">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    if (!notifDropdownOpen) setUserDropdownOpen(false);
                  }}
                  className="h-9 w-9 rounded-xl border border-slate-200/70 hover:bg-slate-100 text-slate-600 hover:text-slate-900 inline-flex items-center justify-center transition-all relative cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3 z-50 animate-in fade-in-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-extrabold text-xs text-slate-900">Notifications</span>
                      <span className="text-[10px] text-purple-700 font-bold">{unreadNotifications.length} Unread</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                      {notifications.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">No notifications yet.</p>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.actionUrl) {
                                if (n.actionUrl.includes('sessions')) setCurrentTab('learn');
                                if (n.actionUrl.includes('credits')) setCurrentTab('credits');
                                if (n.actionUrl.includes('marketplace')) setCurrentTab('marketplace');
                              }
                              setNotifDropdownOpen(false);
                            }}
                            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                              n.read ? 'bg-slate-50 hover:bg-slate-100' : 'bg-purple-50/80 hover:bg-purple-100 border border-purple-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-slate-900 text-[11px]">{n.title}</span>
                              <span className="text-[9px] text-slate-400">{n.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative shrink-0">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    if (!userDropdownOpen) setNotifDropdownOpen(false);
                  }}
                  className="h-9 px-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/70 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer"
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-6 h-6 rounded-lg object-cover ring-1.5 ring-purple-600/40 shrink-0"
                  />
                  <span className="hidden sm:inline font-bold max-w-[85px] lg:max-w-[105px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-3 z-50 animate-in fade-in-50">
                    
                    {/* Current Active User Profile Summary */}
                    <div className="pb-3 border-b border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">{currentUser.name}</span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                          {currentUser.credits} Credits
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.institution}</p>
                    </div>

                    {/* Navigation Links inside dropdown */}
                    <div className="space-y-1 text-xs font-semibold text-slate-700">
                      <button
                        onClick={() => { setCurrentTab('dashboard'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                      >
                        <span>Dashboard & My Profile</span>
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      </button>

                      <button
                        onClick={() => { setCurrentTab('learn'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                      >
                        <span>My Learning Sessions</span>
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                      </button>

                      <button
                        onClick={() => { setCurrentTab('marketplace'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                      >
                        <span>My Book Listings</span>
                        <BookOpen className="w-4 h-4 text-slate-400" />
                      </button>

                      <button
                        onClick={() => { setCurrentTab('credits'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                      >
                        <span>Credit Wallet & History</span>
                        <Coins className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>

                    {/* Switch Student Account */}
                    <div className="pt-3 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                        Switch Student Profile
                      </span>
                      <div className="space-y-1 text-xs max-h-52 overflow-y-auto pr-1">
                        {allUsers.map(user => (
                          <button
                            key={user.id}
                            onClick={() => {
                              switchUserById(user.id);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                              user.id === currentUser.id 
                                ? 'bg-purple-100 text-purple-900 font-extrabold' 
                                : 'hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-lg object-cover" />
                              <span className="truncate max-w-[130px]">{user.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">{user.credits}c</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Register New Profile Trigger */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          onOpenAuth();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Register New Student</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden h-9 w-9 rounded-xl border border-slate-200/70 hover:bg-slate-100 text-slate-700 inline-flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100 space-y-3 animate-in slide-in-from-top-2">
              {/* User card in mobile drawer */}
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-purple-600 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{currentUser.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{currentUser.course}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-sm">
                    <Coins className="w-3 h-3 fill-current" />
                    <span>{currentUser.credits} Credits</span>
                  </span>
                </div>
              </div>

              {/* Nav Links */}
              <div className="space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isActive ? 'bg-purple-100 text-purple-950 font-extrabold shadow-sm border border-purple-200' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Top-up in Mobile Drawer */}
              <button
                onClick={() => {
                  setPendingUnlockTeacherId(null);
                  setFakePaymentModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Coins className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Add / Top-Up Credits</span>
              </button>
            </div>
          )}

        </div>
      </header>
    </>
  );
};
