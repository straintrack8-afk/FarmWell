import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Automatically scrolls to top (0, 0) whenever route changes
 * This ensures consistent UX across all page navigations
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'  // Instant scroll (no smooth animation for page changes)
    });
  }, [pathname]);  // Triggers whenever URL pathname changes

  return null;  // This component renders nothing
}

export default ScrollToTop;
