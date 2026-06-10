import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * FarmGuideTopNav — compact header for FarmGuide inner pages
 *
 * Props:
 * - title (string): page title shown in center (optional)
 * - backPath (string): where back button navigates (default: '/farmguide')
 * - backLabel (string): label on back button (default: 'FarmGuide')
 */
const FarmGuideTopNav = ({
    title = '',
    backPath = '/farmguide',
    backLabel = 'FarmGuide',
}) => {
    const navigate = useNavigate();

    return (
        <div style={{
            background: 'linear-gradient(160deg, #3DC470 0%, #2EAA5E 50%, #1E7A42 100%)',
            padding: '12px 16px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
        }}>
            {/* Left: FarmWell logo → back to /farmguide */}
            <button
                onClick={() => navigate(backPath)}
                title={backLabel}
                style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '4px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
                <img
                    src="/images/FarmWell_Logo.png"
                    alt="FarmWell"
                    style={{ width: 32, height: 32, objectFit: 'contain' }}
                />
            </button>

            {/* Center: page title */}
            {title ? (
                <div style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: 'white',
                    letterSpacing: '0.5px',
                    textAlign: 'center',
                    flex: 1,
                    padding: '0 8px',
                }}>
                    {title}
                </div>
            ) : <div style={{ flex: 1 }} />}

            {/* Right: spacer to balance layout */}
            <div style={{ width: '40px', flexShrink: 0 }} />
        </div>
    );
};

export default FarmGuideTopNav;
