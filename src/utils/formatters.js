/**
 * Format description text by removing markdown and converting to bullet points
 */
export function formatDescription(text) {
    if (!text) return '';

    // Remove all ** markdown
    let cleaned = text.replace(/\*\*/g, '');

    // Split by periods followed by space and capital letter (sentence boundaries)
    // But preserve periods in abbreviations like "U.S." or "Dr."
    const sentences = cleaned
        .split(/\.\s+(?=[A-Z])/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

    // If we have multiple sentences, format as bullet points
    if (sentences.length > 1) {
        return sentences.map(s => {
            // Add period back if not present
            const sentence = s.endsWith('.') ? s : s + '.';
            return `• ${sentence}`;
        }).join('\n');
    }

    // Single sentence, just return cleaned
    return cleaned;
}

/**
 * Format text for display - removes markdown, keeps as paragraph
 */
export function cleanText(text) {
    if (!text) return '';
    return text.replace(/\*\*/g, '').replace(/\*/g, '');
}
