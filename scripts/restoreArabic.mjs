import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const descriptions = JSON.parse(readFileSync('scripts/arabic_descriptions.json', 'utf-8'));
let restored = 0;
let skipped = 0;

for (const [filePath, arabicDesc] of Object.entries(descriptions)) {
    try {
        const content = readFileSync(filePath, 'utf-8');
        // Match English description and replace with Arabic
        const updated = content.replace(
            /(\bdescription:\s*")((?:[^"\\]|\\.)*)(")/,
            (match, before, oldDesc, after) => {
                if (/[؀-ۿ]/.test(oldDesc)) {
                    // Already Arabic, skip
                    return match;
                }
                return `${before}${arabicDesc}${after}`;
            }
        );
        if (updated !== content) {
            writeFileSync(filePath, updated, 'utf-8');
            restored++;
        } else {
            skipped++;
        }
    } catch (e) {
        // File might not exist (removed in upstream) - skip
        skipped++;
    }
}

console.log(`Restored: ${restored}, Skipped: ${skipped}`);
