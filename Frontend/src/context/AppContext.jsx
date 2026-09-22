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
  
  // Persistent Gemini-style sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('scheme_guard_sidebar_open');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileMenuOpen(prev => !prev);
    } else {
      setIsSidebarOpen(prev => {
        const next = !prev;
        try {
          localStorage.setItem('scheme_guard_sidebar_open', String(next));
        } catch (e) {}
        return next;
      });
    }
  };

  const setSidebarOpen = (valueOrFn) => {
    setIsSidebarOpen(prev => {
      const next = typeof valueOrFn === 'function' ? valueOrFn(prev) : valueOrFn;
      try {
        localStorage.setItem('scheme_guard_sidebar_open', String(next));
      } catch (e) {}
      return next;
    });
  };

  // Global active dropdown for 100% mutual exclusivity across header, topbar, public bars
  const [activeGlobalDropdown, setActiveGlobalDropdown] = useState(null);

  // Global non-blocking data/route loading state for 3D cube HUD
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem('mplads_theme');
    document.documentElement.classList.remove('dark', 'light', 'aero-theme');
  }, []);

  const toggleDropdown = (dropdownId) => {
    setActiveGlobalDropdown(curr => curr === dropdownId ? null : dropdownId);
  };

  const closeDropdowns = () => {
    setActiveGlobalDropdown(null);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (
        !e.target.closest('[data-dropdown-trigger]') &&
        !e.target.closest('[data-dropdown-menu]')
      ) {
        setActiveGlobalDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const isAllRead = localStorage.getItem('scheme_guard_notifications_read') === 'true';
    const res = await api.getNotifications();
    if (res.success && Array.isArray(res.data)) {
      const data = isAllRead ? res.data.map(n => ({ ...n, unread: false })) : res.data;
      setNotifications(data);
      setUnreadCount(data.filter(n => n.unread).length);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
    } catch (e) {}
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, unread: false } : n);
      const remaining = updated.filter(n => n.unread).length;
      setUnreadCount(remaining);
      if (remaining === 0) {
        localStorage.setItem('scheme_guard_notifications_read', 'true');
      }
      return updated;
    });
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.markNotificationRead('all');
    } catch (e) {}
    localStorage.setItem('scheme_guard_notifications_read', 'true');
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const showToast = (message, type = 'info', duration = 4000) => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  // Global keyboard shortcuts (Ctrl+K for search, Ctrl+B for sidebar toggle)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable) {
          return;
        }
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeGlobalDropdown,
        setActiveGlobalDropdown,
        toggleDropdown,
        closeDropdowns,
        isGlobalLoading,
        setIsGlobalLoading,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        toast,
        showToast,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSidebarOpen,
        setIsSidebarOpen: setSidebarOpen,
        toggleSidebar,
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
