import translate from 'translate';
import fs from 'fs';

translate.engine = 'google';

const inputFile = 'A:/Projects/FarmWell/FarmWell/public/data/swine/pig-diseases.json';
const outputFile = 'A:/Projects/FarmWell/FarmWell/public/data/swine/pig-diseases-translated.json';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function translateText(text, targetLang) {
    if (!text) return text;
    // if it's already an object, get the 'en' part
    const enText = typeof text === 'object' ? text.en : text;
    if (!enText) return '';
    if (typeof enText !== 'string') return enText;

    try {
        const res = await translate(enText, targetLang);
        return res;
    } catch (e) {
        console.error(`Failed to translate text: ${enText.substring(0, 20)}... to ${targetLang}. Rate limited?`, e.message);
        return enText; // fallback to English
    }
}

async function processDiseases() {
    console.log('Reading data...');
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        console.log(`Processing disease ${i + 1}/${data.length}: ${item.name.en || item.name}`);

        const fieldsToTranslate = ['name', 'description', 'diagnosisMethod', 'controlPrevention', 'treatmentOptions'];

        for (const field of fieldsToTranslate) {
            const originalVal = item[field];
            if (!originalVal) continue;

            // If it's already fully translated
            if (typeof originalVal === 'object' && originalVal.id && originalVal.vi && originalVal.id !== originalVal.en && originalVal.vi !== originalVal.en) {
                continue;
            }

            const enText = typeof originalVal === 'object' ? originalVal.en : originalVal;

            let idText = typeof originalVal === 'object' ? originalVal.id : null;
            let viText = typeof originalVal === 'object' ? originalVal.vi : null;

            if ((!idText || idText === enText) && enText) {
                const tr = await translateText(enText, 'id');
                if (tr) idText = tr;
                await delay(1000); // 1 second delay
            }

            if ((!viText || viText === enText) && enText) {
                const tr = await translateText(enText, 'vi');
                if (tr) viText = tr;
                await delay(1000);
            }

            item[field] = {
                en: enText,
                id: idText || enText,
                vi: viText || enText
            };
        }

        // Save intermediate results
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    }

    // Also overwrite original file
    fs.writeFileSync(inputFile, JSON.stringify(data, null, 2));
    console.log('Finished translation entirely!');
}

processDiseases().catch(console.error);
