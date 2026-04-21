export const flockStorage = {
    getAllFlocks() {
        const index = JSON.parse(localStorage.getItem('farmguide_flocks_index') || '[]');
        return index.map(id => {
            const data = localStorage.getItem(`farmguide_flock_${id}`);
            return data ? JSON.parse(data) : null;
        }).filter(Boolean);
    },

    getFlock(flockId) {
        const data = localStorage.getItem(`farmguide_flock_${flockId}`);
        return data ? JSON.parse(data) : null;
    },

    saveFlock(flock) {
        const index = JSON.parse(localStorage.getItem('farmguide_flocks_index') || '[]');
        if (!index.includes(flock.id)) {
            index.push(flock.id);
            localStorage.setItem('farmguide_flocks_index', JSON.stringify(index));
        }
        localStorage.setItem(`farmguide_flock_${flock.id}`, JSON.stringify(flock));
    },

    getHistory(flockId) {
        return JSON.parse(localStorage.getItem(`farmguide_flock_${flockId}_history`) || '[]');
    },

    saveEntry(flockId, entry) {
        const history = this.getHistory(flockId);
        
        // Layer entries use 'week' field, Broiler/Color Chicken use 'day' field
        const isLayerEntry = entry.week !== undefined && entry.week !== null;
        const idx = isLayerEntry
            ? history.findIndex(h => Number(h.week) === Number(entry.week))
            : history.findIndex(h => Number(h.day) === Number(entry.day));
        
        if (idx >= 0) {
            // Update existing entry
            history[idx] = entry;
        } else {
            // Append new entry
            history.push(entry);
        }
        
        // Sort by week for Layer, by day for others
        if (isLayerEntry) {
            history.sort((a, b) => Number(a.week || 0) - Number(b.week || 0));
        } else {
            history.sort((a, b) => Number(a.day || 0) - Number(b.day || 0));
        }
        
        localStorage.setItem(`farmguide_flock_${flockId}_history`, JSON.stringify(history));
    },

    deleteFlock(flockId) {
        const index = JSON.parse(localStorage.getItem('farmguide_flocks_index') || '[]');
        const newIndex = index.filter(id => id !== flockId);
        localStorage.setItem('farmguide_flocks_index', JSON.stringify(newIndex));
        localStorage.removeItem(`farmguide_flock_${flockId}`);
        localStorage.removeItem(`farmguide_flock_${flockId}_history`);
    },

    generateId() {
        return 'flock_' + Date.now().toString(36);
    },
};
