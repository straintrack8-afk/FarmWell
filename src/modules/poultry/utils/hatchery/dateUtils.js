/**
 * Date utilities for Hatchery Audit
 */

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'time')
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'short') {
    if (!date) return '';

    const d = new Date(date);

    if (isNaN(d.getTime())) return '';

    const options = {
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        long: { year: 'numeric', month: 'long', day: 'numeric' },
        time: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    };

    return d.toLocaleDateString('en-US', options[format] || options.short);
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(date) {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Format time for input fields (HH:MM)
 */
export function formatTimeForInput(date) {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

/**
 * Add days to a date
 */
export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Calculate next quarterly audit date
 */
export function calculateNextQuarterlyDate(lastAuditDate) {
    if (!lastAuditDate) {
        return new Date();
    }

    const lastDate = new Date(lastAuditDate);
    return addDays(lastDate, 90); // 3 months ≈ 90 days
}

/**
 * Check if date is overdue
 */
export function isOverdue(dueDate) {
    if (!dueDate) return false;

    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return due < today;
}

/**
 * Get days until due
 */
export function daysUntilDue(dueDate) {
    if (!dueDate) return null;

    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 days")
 */
export function formatRelativeTime(date) {
    if (!date) return '';

    const d = new Date(date);
    const now = new Date();

    const diffMs = now - d;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffDay < 30) {
        const weeks = Math.floor(diffDay / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (diffDay < 365) {
        const months = Math.floor(diffDay / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }

    const years = Math.floor(diffDay / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
}

/**
 * Get current quarter
 */
export function getCurrentQuarter() {
    const now = new Date();
    const month = now.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    const year = now.getFullYear();

    return `Q${quarter} ${year}`;
}

/**
 * Get date range for a quarter
 */
export function getQuarterDateRange(year, quarter) {
    const startMonth = (quarter - 1) * 3;
    const startDate = new Date(year, startMonth, 1);
    const endDate = new Date(year, startMonth + 3, 0);

    return { startDate, endDate };
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString) {
    if (!dateString) return null;

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
}

/**
 * Get incubation completion date (3-5 days)
 */
export function getIncubationCompletionDate(startDate, days = 5) {
    return addDays(startDate, days);
}

/**
 * Format duration in days
 */
export function formatDuration(days) {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''}`;
    }
    if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months} month${months > 1 ? 's' : ''}`;
    }

    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? 's' : ''}`;
}
