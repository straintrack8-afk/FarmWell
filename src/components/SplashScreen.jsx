import React, { useEffect, useState } from 'react';

/**
 * FarmWell Splash Screen Component
 * Shows branding animation on first load, then calls onComplete() to reveal the app.
 *
 * Props:
 *  - onComplete: () => void  — called after splash animation finishes
 *  - duration: number (ms)  — how long to show the splash (default 3500ms)
 */
const SplashScreen = ({ onComplete, duration = 3500 }) => {
    const [fading, setFading] = useState(false);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setFading(true); // trigger CSS opacity → 0
        }, duration);

        const hideTimer = setTimeout(() => {
            setHidden(true);  // remove from DOM flow
            if (onComplete) onComplete();
        }, duration + 1000); // +1 000ms matches the 1s CSS transition

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, [duration, onComplete]);

    if (hidden) return null;

    return (
        <div
            id="fw-splash-screen"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#FAFAFA',
                zIndex: 99999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                opacity: fading ? 0 : 1,
                transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            {/* Brand Logo */}
            <div className="fw-splash-brand">
                <img
                    src="/images/FarmWell_Logo.png"
                    alt="FarmWell Logo"
                    className="fw-splash-logo-img"
                />
            </div>

            {/* Powered By */}
            <div className="fw-splash-powered">
                <span className="fw-splash-powered-text">Powered by</span>
                <img
                    src="/images/Vaksindo_logo.png"
                    alt="Vaksindo Logo"
                    className="fw-splash-vaksindo-logo"
                />
            </div>
        </div>
    );
};

export default SplashScreen;
