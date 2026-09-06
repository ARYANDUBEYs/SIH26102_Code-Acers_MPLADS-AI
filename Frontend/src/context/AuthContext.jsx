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
    // Inferred role if not explicitly passed
    let effectiveRole = selectedRole;
    if (!effectiveRole) {
      const em = (email || '').toLowerCase();
      if (em.includes('admin') || em.includes('mospi')) {
        effectiveRole = ROLES.MOSPI_ADMIN;
      } else if (em.includes('district') || em.includes('collector') || em.includes('varanasi') || em.includes('dm')) {
        effectiveRole = ROLES.DISTRICT_OFFICER;
      } else {
        effectiveRole = ROLES.CITIZEN;
      }
    }

    const matchedUser = DEMO_USERS.find(u => u.role === effectiveRole) || {
      id: `USR-${Date.now()}`,
      email,
      name: effectiveRole === ROLES.MOSPI_ADMIN ? 'Dr. Rajeshwar Sharma' : effectiveRole === ROLES.DISTRICT_OFFICER ? 'Priyanka Verma, IAS' : 'Amit Patel',
      role: effectiveRole,
      badge: effectiveRole === ROLES.MOSPI_ADMIN ? 'Central MoSPI Director' : effectiveRole === ROLES.DISTRICT_OFFICER ? 'District Magistrate' : 'Citizen Auditor',
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
