import React from 'react';

const SharedFooter = () => {
    return (
        <>
            {/* Vaksindo logo */}
            <div className="fw-supported">
                <div className="fw-sup-logos">
                    <img src="/images/Vaksindo_logo.png" alt="Vaksindo" className="fw-vaksindo-logo" />
                </div>
            </div>
            {/* Footer */}
            <footer className="fw-footer">
                <div className="fw-footer-copy">© 2025 FarmWell · Integrated Livestock Platform</div>
            </footer>
        </>
    );
};

export default SharedFooter;
