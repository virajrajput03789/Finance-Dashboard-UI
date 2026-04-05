import { memo } from 'react';
import { motion } from 'framer-motion';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface WealthTileProps {
  title: string;
  value: number;
  icon: string;
  badge?: string;
  badgeColor?: 'emerald' | 'tertiary' | 'error';
  description?: string;
  index: number;
  sparklineData?: Array<{ amount: number }>;
}

const WealthTileComponent = ({
  title,
  value,
  icon,
  badge,
  badgeColor = 'emerald',
  description,
  index,
  sparklineData,
}: WealthTileProps) => {
  // Use animated counter for premium number animation
  const { formatted: animatedValue, ref: counterRef } = useAnimatedCounter(value, 1.8);

  const tileVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.94, filter: 'blur(4px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
        mass: 0.8,
        delay: i * 0.12,
      },
    }),
  };

  const badgeColorMap = {
    emerald: 'text-emerald-600 bg-emerald-50',
    tertiary: 'text-tertiary bg-tertiary-fixed',
    error: 'text-error bg-error-fixed',
  };

  const isPositive = value >= 0;

  return (
    <motion.div
      custom={index}
      variants={tileVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -6,
        scale: 1.02,
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)',
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 25,
        },
      }}
      whileTap={{ scale: 0.99, y: -2 }}
      className="bg-surface-container-lowest p-8 rounded-xl editorial-shadow transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20 overflow-hidden relative"
    >
      {/* Animated gradient background on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 0.03 }}
        style={{
          background: 'radial-gradient(circle at 100% 100%, rgba(16,185,129,0.2), transparent)',
        }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <motion.div
            className="h-10 w-10 flex items-center justify-center bg-primary-fixed rounded-full text-primary"
            whileHover={{ rotate: 8, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <span className="material-symbols-outlined" data-icon={icon}>
              {icon}
            </span>
          </motion.div>
          {badge && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.12 + 0.2 }}
              className={`text-xs font-bold px-2 py-1 rounded-full ${badgeColorMap[badgeColor]}`}
            >
              {badge}
            </motion.span>
          )}
        </div>

        <h3 className="text-on-surface-variant text-sm font-medium mb-1">{title}</h3>
        <motion.div
          ref={counterRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.12 + 0.15 }}
          className="text-4xl font-headline font-extrabold text-primary tracking-tighter tabular-nums"
        >
          <motion.span
            animate={{
              backgroundImage: [
                'linear-gradient(90deg, rgba(16,185,129,0), rgba(16,185,129,0))',
              ],
            }}
          >
            {animatedValue}
          </motion.span>
        </motion.div>

        {/* Sparkline - 7 day trend */}
        {sparklineData && sparklineData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12 + 0.3 }}
            className="mt-4 h-12 -mx-2"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sparklineData}
                margin={{ top: 4, right: 0, left: 0, bottom: 4 }}
              >
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={isPositive ? '#10b981' : '#ef4444'}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.12 + 0.25 }}
            className="mt-6 pt-6 border-t border-surface-container/50"
          >
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">
              {description}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export const WealthTile = memo(WealthTileComponent);
