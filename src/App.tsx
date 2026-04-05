import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { InsightsPage } from './pages/InsightsPage';
import { FinanceProvider } from './context/FinanceContext';
import { TransactionModal } from './components/Transactions/TransactionModal';
import { ToastContainer } from './components/Shared/ToastContainer';
import { useToast } from './hooks';

// Premium page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 24,
    filter: 'blur(8px)',
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: 'blur(4px)',
    scale: 0.99,
  },
};

function AppContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'insights'>('dashboard');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Initialize based on window size: closed on mobile, open on desktop
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 768;
  });
  const { toasts, removeToast } = useToast();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [activeTab]);

  // Handle Escape key to close sidebar on mobile
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Handle window resize to adjust sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Inter'] overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setShowAddModal={setShowTransactionModal}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className="lg:ml-60 px-4 sm:px-6 md:px-8 lg:px-10 pb-10 min-h-screen relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{ willChange: 'transform, opacity, filter' }}
          >
            {activeTab === 'dashboard' && <DashboardPage />}
            {activeTab === 'transactions' && <TransactionsPage />}
            {activeTab === 'insights' && <InsightsPage />}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-24 pt-12 pb-24 border-t border-surface-container flex flex-col md:flex-row justify-between items-center text-on-surface-variant">
          <div className="mb-4 md:mb-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em]">The Sovereign Ledger</p>
            <p className="text-[10px] mt-1 opacity-60">© 2025. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold">
            <a className="hover:text-primary" href="#">Legal</a>
            <a className="hover:text-primary" href="#">Disclosure</a>
            <a className="hover:text-primary" href="#">Support</a>
          </div>
        </footer>
      </main>

      {showTransactionModal && (
        <TransactionModal isOpen={true} onClose={() => setShowTransactionModal(false)} />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
