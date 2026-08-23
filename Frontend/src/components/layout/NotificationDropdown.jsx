import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, Check, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/helpers';

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markNotificationAsRead } = useApp();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'CRITICAL':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
      onClose();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Intelligence Alerts
          </span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-rose-500 text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-400">Live AI Feed</span>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">No new notifications</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={cn(
                'p-3.5 flex items-start gap-3 cursor-pointer transition-colors text-left',
                notif.unread ? 'bg-slate-800/40 hover:bg-slate-800/80' : 'hover:bg-slate-800/30 opacity-75'
              )}
            >
              <div className="mt-0.5">{getIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-slate-100 truncate">{notif.title}</p>
                  {notif.unread && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">{notif.message}</p>
                <span className="text-[10px] font-mono text-slate-500 mt-1.5 block">{notif.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2 bg-slate-950 border-t border-slate-800 text-center">
        <button
          onClick={() => {
            notifications.forEach(n => markNotificationAsRead(n.id));
            onClose();
          }}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium py-1"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
};
