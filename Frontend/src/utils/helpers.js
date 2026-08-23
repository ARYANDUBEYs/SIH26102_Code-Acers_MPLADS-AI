import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RISK_LEVELS } from './constants';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount, format = 'auto') {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  
  const num = Number(amount);
  
  if (format === 'crore' || (format === 'auto' && Math.abs(num) >= 10000000)) {
    const cr = (num / 10000000).toFixed(2);
    return `₹${cr.replace(/\.00$/, '')} Cr`;
  }
  
  if (format === 'lakh' || (format === 'auto' && Math.abs(num) >= 100000)) {
    const lakh = (num / 100000).toFixed(2);
    return `₹${lakh.replace(/\.00$/, '')} Lakh`;
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function getRiskMeta(score) {
  const num = Number(score) || 0;
  if (num >= 86) return { ...RISK_LEVELS.CRITICAL, key: 'CRITICAL', score: num };
  if (num >= 61) return { ...RISK_LEVELS.HIGH, key: 'HIGH', score: num };
  if (num >= 31) return { ...RISK_LEVELS.MEDIUM, key: 'MEDIUM', score: num };
  return { ...RISK_LEVELS.LOW, key: 'LOW', score: num };
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getDaysRemaining(targetDate) {
  if (!targetDate) return { days: 0, isOverdue: false, urgency: 'safe' };
  const target = new Date(targetDate);
  const now = new Date();
  const diffTime = target - now;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (days < 0) return { days: Math.abs(days), isOverdue: true, urgency: 'critical', text: `${Math.abs(days)}d Overdue` };
  if (days <= 3) return { days, isOverdue: false, urgency: 'critical', text: `${days}d Remaining` };
  if (days <= 7) return { days, isOverdue: false, urgency: 'warning', text: `${days}d Remaining` };
  return { days, isOverdue: false, urgency: 'safe', text: `${days}d Remaining` };
}

export function truncateText(text, maxLength = 60) {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
