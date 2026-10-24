import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FakePaymentModal } from './components/FakePaymentModal';
import { EarnedCreditModal } from './components/EarnedCreditModal';
import { AuthModal } from './components/AuthModal';
import { CreditToast } from './components/CreditToast';
import { LiveMeetModal } from './components/LiveMeetModal';

import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { LearnTogetherPage } from './pages/LearnTogetherPage';
import { MyCreditsPage } from './pages/MyCreditsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { WritingGigsPage } from './pages/WritingGigsPage';

const MainAppContent: React.FC = () => {
  const { learningSessions, setActiveLiveMeetSession } = useApp();
  const validTabs = ['home', 'learn', 'marketplace', 'writing', 'credits', 'dashboard', 'admin'];

  // Helper to extract room slug/ID from URL pathname (/room/:id), search (?room=:id), or hash (#room=:id)
  const extractRoomIdFromUrl = (): string | null => {
    // 1. Pathname: /room/iot-lab-group-4
    const path = window.location.pathname;
    const pathMatch = path.match(/\/room\/([^/?#]+)/i);
    if (pathMatch) return pathMatch[1];

    // 2. Query param: ?room=iot-lab-group-4
    const search = window.location.search;
    if (search) {
      const params = new URLSearchParams(search);
      const room = params.get('room');
      if (room) return room;
    }

    // 3. Hash: #room=iot-lab-group-4 or #room/iot-lab-group-4
    const hash = window.location.hash;
    if (hash) {
      const hashMatch = hash.match(/room[=/]([^&?]+)/i);
      if (hashMatch) return hashMatch[1];
    }

    return null;
  };

  const getInitialTab = (): string => {
    if (extractRoomIdFromUrl()) {
      return 'learn';
    }
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (validTabs.includes(hash)) {
      return hash;
    }
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    if (validTabs.includes(path)) {
      return path;
    }
    return 'home';
  };

  const [currentTab, setCurrentTabState] = useState<string>(getInitialTab);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const setCurrentTab = (tab: string) => {
    setCurrentTabState(tab);
    window.location.hash = tab;
  };

  // Handle URL changes & room deep linking
  React.useEffect(() => {
    const handlePopState = () => {
      const roomId = extractRoomIdFromUrl();
      if (roomId) {
        setCurrentTabState('learn');
        return;
      }
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (validTabs.includes(hash)) {
        setCurrentTabState(hash);
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Automatically trigger LiveMeetModal when entering via a /room/... link
  React.useEffect(() => {
    const roomId = extractRoomIdFromUrl();
    if (!roomId) return;

    setCurrentTabState('learn');

    const normalizedRoom = roomId.toLowerCase().trim();
    const matched = learningSessions.find(s => 
      s.id.toLowerCase() === normalizedRoom ||
      (s.meetLink && s.meetLink.toLowerCase().includes(normalizedRoom)) ||
      (s.topic && s.topic.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(normalizedRoom))
    );

    if (matched) {
      setActiveLiveMeetSession(matched);
    } else {
      const autoRoomTopic = roomId
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      const fallbackSession = {
        id: `room-${roomId}`,
        topic: autoRoomTopic || 'Live Study Circle',
        skillName: 'Peer Learning',
        mentorId: 'user-abiya',
        mentorName: 'Abiya Daniel (Mentor)',
        mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
        learnerId: 'user-amal',
        learnerName: 'Enrolled Peer',
        learnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        scheduledDate: 'Today',
        timeSlot: 'Now Streaming',
        format: 'Online Video' as const,
        status: 'upcoming' as const,
        creditsRequired: 2,
        creditsTransferred: false,
        confirmedByMentor: false,
        confirmedByLearner: false,
        notes: `Live interactive classroom for ${roomId}.`,
        meetLink: `/room/${roomId}`,
        sessionType: 'group' as const,
        maxParticipants: 4,
        isLive: true,
        enrolledParticipants: []
      };
      setActiveLiveMeetSession(fallbackSession);
    }
  }, [learningSessions]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      
      {/* Clean, Professional Navigation Bar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onOpenAuth={() => setIsAuthModalOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'home' && <HomePage onNavigate={setCurrentTab} />}
        {currentTab === 'learn' && <LearnTogetherPage />}
        {currentTab === 'marketplace' && <MarketplacePage initialTab="books" />}
        {currentTab === 'writing' && <MarketplacePage initialTab="writing" />}
        {currentTab === 'credits' && <MyCreditsPage onNavigateToLearn={() => setCurrentTab('learn')} />}
        {currentTab === 'dashboard' && <DashboardPage onNavigate={setCurrentTab} />}
        {currentTab === 'admin' && <AdminPage />}
      </main>

      {/* Interactive Credit Adjustment Toast (+2 / -2 Credits) */}
      <CreditToast />

      {/* Credit Wallet Top-up Modal */}
      <FakePaymentModal />

      {/* Post-Teaching Earned Credit Celebration Modal */}
      <EarnedCreditModal 
        onNavigateToLearn={() => setCurrentTab('learn')} 
      />

      {/* User Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Live Meet Video Classroom Modal */}
      <LiveMeetModal />

      {/* Site-wide Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
