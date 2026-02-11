import { useState, useEffect } from 'react';

const CONSENT_KEY = 'farmwell_disease_disclaimer_accepted';

export function useDisclaimerConsent() {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage on mount
    const consent = localStorage.getItem(CONSENT_KEY);
    setHasConsented(consent === 'true');
    setIsLoading(false);
  }, []);

  const giveConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setHasConsented(true);
  };

  const revokeConsent = () => {
    localStorage.removeItem(CONSENT_KEY);
    setHasConsented(false);
  };

  return { hasConsented, isLoading, giveConsent, revokeConsent };
}
