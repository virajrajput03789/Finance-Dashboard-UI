import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'onboarding';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  variant = 'default',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-8 rounded-xl ${
      variant === 'onboarding' 
        ? 'bg-primary/5 border border-primary/20' 
        : 'bg-surface-container-lowest'
    }`}>
      <div className={`mb-6 rounded-full p-4 ${
        variant === 'onboarding' ? 'bg-primary/10' : 'bg-surface-container'
      }`}>
        <span 
          className={`material-symbols-outlined text-5xl ${
            variant === 'onboarding' ? 'text-primary' : 'text-on-surface-variant'
          }`} 
          data-icon={icon}
        >
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-headline font-bold text-on-surface mb-2">{title}</h3>
      <p className="text-center text-on-surface-variant max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors active:scale-95 cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
