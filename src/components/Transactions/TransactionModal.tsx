import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import type { Transaction, TransactionType } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editData?: Transaction | null;
}

interface FormErrors {
  description?: string;
  amount?: string;
  date?: string;
  category?: string;
  type?: string;
}

export const TransactionModal: React.FC<Props> = ({ isOpen, onClose, editData }) => {
  const { addTransaction, editTransaction } = useFinance();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    type: 'Expense' as TransactionType,
    date: new Date().toISOString().slice(0, 10),
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (editData) {
      setFormData({
        description: editData.description,
        amount: editData.amount.toString(),
        category: editData.category,
        type: editData.type,
        date: editData.date,
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        category: 'Food',
        type: 'Expense',
        date: new Date().toISOString().slice(0, 10),
      });
    }
    setErrors({});
    setShowSuccess(false);
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate description
    if (!formData.description || formData.description.trim().length < 2) {
      newErrors.description = 'Description must be at least 2 characters';
    }

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    // Validate category
    if (!formData.category || formData.category.trim().length === 0) {
      newErrors.category = 'Sector must be selected';
    }

    // Validate date
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (selectedDate > today) {
      newErrors.date = 'Date cannot be in the future';
    }

    // Validate type
    if (!formData.type) {
      newErrors.type = 'Transaction type must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const payload = {
      description: formData.description,
      amount: Number(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date
    };

    if (editData) {
      editTransaction(editData.id, payload);
    } else {
      addTransaction(payload);
    }

    // Show success message
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const categories = ['Food', 'Transport', 'Shopping', 'Healthcare', 'Entertainment', 'Salary', 'Freelance', 'Rent', 'Utilities', 'Real Estate', 'Equities', 'Digital Assets', 'Other'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-emerald-950/40 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest/90 backdrop-blur-2xl rounded-2xl w-full max-w-lg editorial-shadow overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        <div className="flex items-center justify-between p-8 border-b border-surface-container">
          <div>
            <h2 className="text-2xl font-headline font-extrabold text-primary tracking-tight">
              {editData ? 'Edit Asset Record' : 'Log New Sovereign Event'}
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mt-1">Sovereign Ledger Entry</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-all text-on-surface-variant hover:text-primary cursor-pointer active:scale-95">
            <span className="material-symbols-outlined" data-icon="close">close</span>
          </button>
        </div>
        
        {showSuccess && (
          <div className="mx-8 mt-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
            <span className="text-sm font-bold text-emerald-500">Transaction logged successfully</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Class</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as TransactionType})}
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 appearance-none outline-hidden"
              >
                <option value="Expense">Expense (Outflow)</option>
                <option value="Income">Income (Inflow)</option>
              </select>
              {errors.type && <p className="text-xs text-error mt-1">{errors.type}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Effective Date</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className={`w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 outline-hidden ${
                  errors.date ? 'border-2 border-error focus:ring-error/20' : 'focus:ring-primary/20'
                }`}
              />
              {errors.date && <p className="text-xs text-error mt-1">{errors.date}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Entity Descriptor</label>
            <input 
              type="text" 
              placeholder="e.g. Metropolitan Loft Management"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`w-full bg-surface-container-low border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 outline-hidden placeholder:text-slate-300 ${
                errors.description ? 'border-error focus:ring-error/20' : 'border-none focus:ring-primary/20'
              }`}
            />
            {errors.description && <p className="text-xs text-error mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Asset Value</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
                <input 
                  type="number" 
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className={`w-full bg-surface-container-low border rounded-xl pl-8 pr-4 py-3 text-sm font-bold font-headline focus:ring-2 outline-hidden tracking-tight ${
                    errors.amount ? 'border-error focus:ring-error/20' : 'border-none focus:ring-primary/20'
                  }`}
                />
              </div>
              {errors.amount && <p className="text-xs text-error mt-1">{errors.amount}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Sector</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={`w-full bg-surface-container-low border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 appearance-none outline-hidden ${
                  errors.category ? 'border-error focus:ring-error/20' : 'border-none focus:ring-primary/20'
                }`}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-error mt-1">{errors.category}</p>}
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-8 py-4 rounded-xl text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:bg-surface-container-low transition-all cursor-pointer active:scale-95"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="flex-[2] px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 transition-all cursor-pointer active:scale-95"
            >
              {editData ? 'Commit Changes' : 'Execute Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
