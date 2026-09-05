import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, DEMO_USERS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mplads_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null; // Public guest by default
  });

  const [role, setRole] = useState(() => {
    return user?.role || ROLES.CITIZEN;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mplads_auth_user', JSON.stringify(user));
      setRole(user.role);
    } else {
      localStorage.removeItem('mplads_auth_user');
    }
  }, [user]);

  const login = async (email, password, selectedRole) => {
    const matchedUser = DEMO_USERS.find(u => u.role === selectedRole) || {
      id: `USR-${Date.now()}`,
      email,
      name: selectedRole === ROLES.MOSPI_ADMIN ? 'Central Admin Officer' : selectedRole === ROLES.DISTRICT_OFFICER ? 'District Collector' : 'Citizen User',
      role: selectedRole,
      badge: selectedRole === ROLES.MOSPI_ADMIN ? 'MoSPI Admin' : selectedRole === ROLES.DISTRICT_OFFICER ? 'District Officer' : 'Citizen',
    };
    setUser(matchedUser);
    setRole(matchedUser.role);
    return { success: true, user: matchedUser };
  };

  const switchRole = (newRole) => {
    const targetUser = DEMO_USERS.find(u => u.role === newRole) || {
      id: `USR-${newRole}`,
      name: newRole === ROLES.MOSPI_ADMIN ? 'Dr. Rajeshwar Sharma' : newRole === ROLES.DISTRICT_OFFICER ? 'Priyanka Verma, IAS' : 'Amit Patel',
      email: `${newRole}@gov.in`,
      role: newRole,
      badge: newRole,
    };
    setUser(targetUser);
    setRole(newRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('mplads_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isAdmin: role === ROLES.MOSPI_ADMIN,
        isDistrictOfficer: role === ROLES.DISTRICT_OFFICER,
        isCitizen: role === ROLES.CITIZEN,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
