/**
 * Format description text by removing markdown and converting to bullet points
 */
export function formatDescription(text) {
    if (!text) return '';

    // Remove all ** markdown
    let cleaned = text.replace(/\*\*/g, '');

    // Split by periods followed by space and capital letter (sentence boundaries)
    // Or split by newlines or semicolons
    const sentences = cleaned
        .split(/\n|;\s*|\.\s+(?=[A-Z])/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

    // If we have multiple sentences/lines, format as bullet points
    if (sentences.length > 1) {
        return sentences.map(s => {
            // Add period back if it was a sentence break and not a newline
            const sentence = s.endsWith('.') ? s : s + '.';
            return `• ${sentence}`;
        }).join('\n');
    }

    // Single sentence, just return cleaned
    return cleaned;
}

/**
 * Split text into an array of bullet points
 */
export function textToBullets(text) {
    if (!text) return [];

    // Remove markdown
    let cleaned = text.replace(/\*\*/g, '').replace(/\*/g, '');

    // Split by periods followed by space and capital letter, or newlines or semicolons
    return cleaned
        .split(/\n|;\s*|\.\s+(?=[A-Z])/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s.endsWith('.') ? s : s + '.');
}

/**
 * Format text for display - removes markdown, keeps as paragraph
 */
export function cleanText(text) {
    if (!text) return '';
    return text.replace(/\*\*/g, '').replace(/\*/g, '');
}
