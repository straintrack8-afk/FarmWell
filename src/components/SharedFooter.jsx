import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const SharedFooter = () => {
    const { t } = useTranslation();

    return (
        <>
            {/* ── SUPPORTED BY ── */}
            <div className="fw-supported">
                <div className="fw-sup-label">{t('welcome.poweredBy') || 'Powered By'}</div>
                <div className="fw-sup-logos">
                    <img src="/images/Vaksindo_logo.png" alt="Vaksindo" className="fw-vaksindo-logo" />
                </div>
            </div>

            {/* ── FOOTER ── */}
            <footer className="fw-footer">
                <div className="fw-footer-copy">© 2025 FarmWell · Integrated Livestock Platform</div>
            </footer>
        </>
    );
};

export default SharedFooter;
