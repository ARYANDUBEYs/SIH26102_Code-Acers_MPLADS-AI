import React from 'react';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn, getDaysRemaining } from '../../utils/helpers';

export const SLAIndicator = ({
  targetDate,
  daysLeft,
  urgency: propUrgency,
  className = '',
  showIcon = true,
}) => {
  let urgency = propUrgency?.toLowerCase();
  let text = '';
  let isOverdue = false;

  if (targetDate) {
    const meta = getDaysRemaining(targetDate);
    urgency = meta.urgency;
    text = meta.text;
    isOverdue = meta.isOverdue;
  } else if (daysLeft !== undefined) {
    if (daysLeft < 0) {
      urgency = 'critical';
      text = `${Math.abs(daysLeft)}d Overdue`;
      isOverdue = true;
    } else if (daysLeft <= 3) {
      urgency = 'critical';
      text = `${daysLeft}d Remaining`;
    } else if (daysLeft <= 7) {
      urgency = 'warning';
      text = `${daysLeft}d Remaining`;
    } else {
      urgency = 'safe';
      text = `${daysLeft}d Remaining`;
    }
  }

  const styles = {
    critical: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    safe: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  };

  const currentStyle = styles[urgency] || styles.safe;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border',
        currentStyle,
        isOverdue && 'animate-critical-pulse',
        className
      )}
    >
      {showIcon && (
        urgency === 'critical' ? (
          <AlertCircle className="w-3 h-3 shrink-0 text-rose-400" />
        ) : urgency === 'warning' ? (
          <AlertTriangle className="w-3 h-3 shrink-0 text-amber-400" />
        ) : (
          <Clock className="w-3 h-3 shrink-0 text-emerald-400" />
        )
      )}
      <span>{text}</span>
    </span>
  );
};
