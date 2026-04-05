
import { cn } from '../../utils';
import { useFinance } from '../../context/FinanceContext';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  activeTab: 'dashboard' | 'transactions' | 'insights';
  setActiveTab: (t: 'dashboard' | 'transactions' | 'insights') => void;
  setShowAddModal: (b: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ activeTab, setActiveTab, setShowAddModal, isOpen = true, onClose }: Props) => {
  const { activeRole } = useFinance();

  const handleNavClick = (tab: 'dashboard' | 'transactions' | 'insights') => {
    setActiveTab(tab);
  };

  const sidebarContent = (
    <>
      <div className="px-8 mb-12">
        <h1 className="text-xl font-bold tracking-tight text-white">Editorial Finance</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/60 mt-1">Sovereign Wealth</p>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {(['dashboard', 'transactions', 'insights'] as const).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => handleNavClick(tab)}
            whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
            whileTap={{ scale: 0.97 }}
            className="w-full relative flex items-center px-4 py-3 rounded-lg transition-all cursor-pointer overflow-hidden"
          >
            {/* Sliding active background - premium spring physics */}
            {activeTab === tab && (
              <motion.div
                layoutId="activeNav"
                className="absolute inset-0 bg-emerald-800/40 rounded-lg"
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 40,
                  mass: 0.8,
                }}
              />
            )}
            
            {/* Content above background */}
            <motion.span
              className={cn(
                "material-symbols-outlined mr-3 relative z-10 transition-colors",
                activeTab === tab ? "text-white" : "text-emerald-200/70"
              )}
              animate={{
                scale: activeTab === tab ? 1.1 : 1,
              }}
              transition={{ type: 'spring', stiffness: 400 }}
              data-icon={tab === 'dashboard' ? 'dashboard' : tab === 'transactions' ? 'receipt_long' : 'leaderboard'}
            >
              {tab === 'dashboard' ? 'dashboard' : tab === 'transactions' ? 'receipt_long' : 'leaderboard'}
            </motion.span>
            <motion.span
              className={cn(
                "text-sm relative z-10 font-medium",
                activeTab === tab 
                  ? "text-white font-semibold" 
                  : "text-emerald-200/70"
              )}
              animate={{
                color: activeTab === tab 
                  ? '#ffffff' 
                  : 'rgba(167, 243, 208, 0.5)',
              }}
              transition={{ duration: 0.2 }}
            >
              {tab === 'dashboard' ? 'Dashboard' : tab === 'transactions' ? 'Ledger' : 'Analytics'}
            </motion.span>
          </motion.button>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        {activeRole === 'admin' && (
          <motion.button 
            onClick={() => setShowAddModal(true)}
            whileHover={{ 
              scale: 1.04,
              boxShadow: '0 0 0 4px rgba(16,185,129,0.15), 0 8px 24px rgba(16,185,129,0.3)',
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-emerald-400 text-emerald-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
            <span className="text-sm">New Transaction</span>
          </motion.button>
        )}

        <div className="mt-8 flex items-center gap-3 px-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="h-10 w-10 rounded-full bg-emerald-900 overflow-hidden shrink-0 cursor-pointer"
          >
            <img 
              alt="Executive Portrait" 
              className="h-full w-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUExa47R4k6wHg2EgVhDCcq1Nso7YH7tBzMWBVbiyNnfp6f-TeB9IgSOq0iq9BmNsAWZfxQjTA7bZRsGUGU6P3JrK1PpVmTNhldCMto5SbAwucNqeor5qNP9QuXHMtK6HijQ-7Niv8g4nkV4YK7bAtFvkdO13ZP5uAlgnwO7Y_c21GiF2tF3MGyLX8b4u4d_Oh5f0HnNFykBUOQFR8eLvYhf88qabaXhIFXMnf-0nGecxNiKsRuVJEou0xYrD-dItdXexdeV6R-RQ"
            />
          </motion.div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-bold truncate">Alexander Vance</p>
            <p className="text-emerald-400/50 text-[10px] truncate">Private Client</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR - always visible on lg+ */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 lg:left-0 bg-emerald-950 dark:bg-black py-8 font-['Manrope'] antialiased z-40">
        {sidebarContent}
      </aside>

      {/* MOBILE OVERLAY - only on mobile */}
      <AnimatePresence>
        {isOpen && window.innerWidth < 1024 && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            {/* Sidebar Panel */}
            <motion.aside
              className="fixed top-0 left-0 h-full w-72 z-50 lg:hidden flex flex-col bg-emerald-950 dark:bg-black py-8 font-['Manrope'] antialiased"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Close button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white hover:bg-emerald-800/50 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
