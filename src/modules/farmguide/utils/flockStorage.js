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
        const idx = history.findIndex(h => h.day === entry.day);
        if (idx >= 0) {
            history[idx] = entry;
        } else {
            history.push(entry);
        }
        history.sort((a, b) => a.day - b.day);
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
