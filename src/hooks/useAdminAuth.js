import { useState, useCallback } from 'react';

const SESSION_KEY = 'farmwell_admin_session';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === 'authenticated'; }
    catch { return false; }
  });

  const login = useCallback((password) => {
    const correct = 'Vaksindo2026$';
    if (password === correct) {
      sessionStorage.setItem(SESSION_KEY, 'authenticated');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
