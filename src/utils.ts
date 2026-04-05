import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Transaction } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function exportToCSV(transactions: Transaction[], filename?: string) {
  const defaultFilename = `sovereign-ledger-export-${new Date().toISOString().split('T')[0]}.csv`;
  const csvFilename = filename || defaultFilename;
  
  // Define CSV headers
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  
  // Convert transactions to CSV rows
  const rows = transactions.map(t => [
    t.date,
    `"${t.description}"`, // Quote to handle commas in description
    t.category,
    t.type,
    t.amount.toFixed(2)
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', csvFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(transactions: Transaction[], filename?: string) {
  const defaultFilename = `sovereign-ledger-${new Date().toISOString().split('T')[0]}.json`;
  const jsonFilename = filename || defaultFilename;
  
  // Format transactions as clean JSON
  const jsonContent = JSON.stringify(transactions, null, 2);
  
  // Create and trigger download
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', jsonFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
