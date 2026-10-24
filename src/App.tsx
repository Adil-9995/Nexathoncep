import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FakePaymentModal } from './components/FakePaymentModal';
import { EarnedCreditModal } from './components/EarnedCreditModal';
import { AuthModal } from './components/AuthModal';
import { CreditToast } from './components/CreditToast';

import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { LearnTogetherPage } from './pages/LearnTogetherPage';
import { MyCreditsPage } from './pages/MyCreditsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
        {currentTab === 'marketplace' && <MarketplacePage />}
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
