import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await api.getNotifications();
    if (res.success) {
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => n.unread).length);
    }
  };

  const markNotificationAsRead = async (id) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const showToast = (message, type = 'info', duration = 4000) => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  // Global keyboard shortcut for search (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        notifications,
        unreadCount,
        markNotificationAsRead,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        toast,
        showToast,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
