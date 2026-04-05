import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../utils';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { activeRole, setActiveRole } = useFinance();

  return (
    <header className="sticky top-0 z-30 lg:ml-60 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 md:h-16 border-b border-surface-container bg-white/95 dark:bg-emerald-950/95 backdrop-blur-sm transition-all duration-200">
      
      {/* Left: Hamburger (mobile) + Search (desktop) */}
      <div className="flex items-center gap-3 flex-1">
        {/* Hamburger - mobile only (hidden on lg+) */}
        <motion.button 
          onClick={onToggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center w-10 h-10 min-w-[44px] min-h-[44px]"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-white">
            <rect y="3" width="20" height="2" rx="1"/>
            <rect y="9" width="20" height="2" rx="1"/>
            <rect y="15" width="20" height="2" rx="1"/>
          </svg>
        </motion.button>
        
        {/* Search - hidden on mobile by default */}
        <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-lg border border-surface-container flex-1 max-w-xs focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <span className="material-symbols-outlined text-gray-400 text-base mr-2" data-icon="search">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 w-full outline-none" 
            placeholder="Search wealth records..." 
            type="text"
          />
        </div>
      </div>

      {/* Right: Role + Icons */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
        {/* Role switcher */}
        <div className="flex items-center text-xs sm:text-sm gap-2 sm:gap-3">
          <motion.button 
            onClick={() => setActiveRole('admin')}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "font-bold pb-1 cursor-pointer transition-all whitespace-nowrap",
              activeRole === 'admin' 
                ? "text-white border-b-2 border-primary" 
                : "text-gray-400 hover:text-white"
            )}
          >
            Admin
          </motion.button>
          <div className="w-px h-4 bg-gray-500/50"></div>
          <motion.button 
            onClick={() => setActiveRole('viewer')}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "font-bold pb-1 cursor-pointer transition-all whitespace-nowrap",
              activeRole === 'viewer' 
                ? "text-white border-b-2 border-primary" 
                : "text-gray-400 hover:text-white"
            )}
          >
            Viewer
          </motion.button>
        </div>
        
        {/* Divider */}
        <div className="hidden md:block h-6 w-px bg-surface-container-high"></div>
        
        {/* Icons */}
        <div className="hidden md:flex gap-3 text-gray-300">
          <motion.button 
            whileHover={{ scale: 1.1, color: '#10b981' }}
            whileTap={{ scale: 0.95 }}
            className="hover:text-primary transition-colors relative cursor-pointer p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-base" data-icon="notifications">notifications</span>
            <span className="absolute top-1 right-1 h-2 w-2 bg-tertiary rounded-full border border-white"></span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, color: '#10b981' }}
            whileTap={{ scale: 0.95 }}
            className="hover:text-primary transition-colors cursor-pointer p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-base" data-icon="help_outline">help_outline</span>
          </motion.button>
        </div>
        
        {/* Profile */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-xs text-white font-medium">
            Executive Admin
          </span>
          <motion.img 
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-full ring-2 ring-primary/20 cursor-pointer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUExa47R4k6wHg2EgVhDCcq1Nso7YH7tBzMWBVbiyNnfp6f-TeB9IgSOq0iq9BmNsAWZfxQjTA7bZRsGUGU6P3JrK1PpVmTNhldCMto5SbAwucNqeor5qNP9QuXHMtK6HijQ-7Niv8g4nkV4YK7bAtFvkdO13ZP5uAlgnwO7Y_c21GiF2tF3MGyLX8b4u4d_Oh5f0HnNFykBUOQFR8eLvYhf88qabaXhIFXMnf-0nGecxNiKsRuVJEou0xYrD-dItdXexdeV6R-RQ"
            alt="Profile"
          />
        </div>
      </div>
    </header>
  );
};
