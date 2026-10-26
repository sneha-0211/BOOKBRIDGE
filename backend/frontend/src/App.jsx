import React, { useState, useEffect } from 'react';
import { StudentProvider, useStudent } from './context/StudentContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import CampusMapModal from './components/CampusMapModal';
import ImpactCalculatorModal from './components/ImpactCalculatorModal';
import FloatingActionWidget from './components/FloatingActionWidget';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ScannerPage from './pages/ScannerPage';
import MarketplacePage from './pages/MarketplacePage';
import MatchingPage from './pages/MatchingPage';
import ShareBookPage from './pages/ShareBookPage';
import ExchangesPage from './pages/ExchangesPage';
import ImpactPage from './pages/ImpactPage';
import AboutPage from './pages/AboutPage';

function MainRouter() {
  const { currentPage, showToast } = useStudent();
  const [searchOpen, setSearchOpen] = useState(false);
  const [campusMapOpen, setCampusMapOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  // Global Keyboard Shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'scanner':
        return <ScannerPage />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'matching':
        return <MatchingPage />;
      case 'share':
        return <ShareBookPage />;
      case 'exchanges':
        return <ExchangesPage />;
      case 'impact':
        return <ImpactPage />;
      case 'about':
        return <AboutPage />;
      case 'landing':
      default:
        return <LandingPage onOpenCampusMap={() => setCampusMapOpen(true)} onOpenCalculator={() => setCalculatorOpen(true)} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7F4] text-[#162220] selection:bg-[#147D64] selection:text-white">
      {/* Sticky Interactive Navbar */}
      <Navbar 
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCampusMap={() => setCampusMapOpen(true)}
        onOpenCalculator={() => setCalculatorOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Command Palette (Ctrl+K) */}
      <CommandPalette 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)}
        onOpenCampusMap={() => setCampusMapOpen(true)}
        onOpenCalculator={() => setCalculatorOpen(true)}
      />

      {/* Interactive Campus Handover Locator Modal */}
      <CampusMapModal
        isOpen={campusMapOpen}
        onClose={() => setCampusMapOpen(false)}
        onSelectStation={(station) => {
          showToast(`Selected "${station.name}" as your designated safe handover station!`, 'success');
        }}
      />

      {/* Interactive CO2 & Savings Calculator Modal */}
      <ImpactCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />

      {/* Floating Action Tool Widget (Bottom Right) */}
      <FloatingActionWidget 
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCampusMap={() => setCampusMapOpen(true)}
        onOpenCalculator={() => setCalculatorOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <StudentProvider>
      <MainRouter />
    </StudentProvider>
  );
}
