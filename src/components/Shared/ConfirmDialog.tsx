import React from 'react';
import { cn } from '../../utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dim/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'bg-surface-container rounded-2xl p-8 w-full max-w-sm',
          'animate-in zoom-in-95 duration-200',
          'border border-outline-variant/20 shadow-lg'
        )}
      >
        <h2 className="text-xl font-headline font-bold text-on-surface mb-2">
          {title}
        </h2>
        <p className="text-sm text-on-surface-variant mb-8">{description}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className={cn(
              'px-6 py-2.5 rounded-lg font-medium text-sm transition-colors cursor-pointer',
              'text-on-surface-variant hover:bg-surface-container-high',
              'active:scale-95'
            )}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'px-6 py-2.5 rounded-lg font-medium text-sm transition-all cursor-pointer',
              'active:scale-95',
              isDangerous
                ? 'bg-error text-on-error hover:brightness-110'
                : 'bg-primary text-on-primary hover:brightness-110'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
