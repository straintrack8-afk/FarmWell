import { useState, useEffect } from 'react';

const CONSENT_KEY = 'farmwell_poultry_disclaimer_accepted';

export function usePoultryDisclaimerConsent() {
    const [hasConsented, setHasConsented] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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
