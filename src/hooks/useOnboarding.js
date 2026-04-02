// src/hooks/useOnboarding.js
import { useState, useCallback } from 'react';

const STORAGE_KEY = 'farmwell_onboarding_v1';

export function useOnboarding() {
  const [isComplete, setIsComplete] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).completed === true : false;
    } catch {
      return false;
    }
  });

  const saveOnboardingData = useCallback((data) => {
    const payload = {
      ...data,
      completed: true,
      completedAt: new Date().toISOString(),
      appVersion: '1.0'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setIsComplete(true);
  }, []);

  const getOnboardingData = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  // Dev utility — jangan hapus
  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsComplete(false);
  }, []);

  return { isComplete, saveOnboardingData, getOnboardingData, resetOnboarding };
}
