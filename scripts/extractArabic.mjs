import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const results = {};

function scanDir(dir) {
    try {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const fullPath = join(dir, entry.name);
            if (entry.isDirectory()) scanDir(fullPath);
            else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
                const content = readFileSync(fullPath, 'utf-8');
                const descMatch = content.match(/description:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/s);
                if (descMatch) {
                    const desc = descMatch[1];
                    if (/[؀-ۿ]/.test(desc)) {
                        const key = fullPath.replace(/\\/g, '/');
                        results[key] = desc;
                    }
                }
            }
        }
    } catch (e) {}
}

scanDir('src');
writeFileSync('scripts/arabic_descriptions.json', JSON.stringify(results, null, 2));
console.log(`Saved ${Object.keys(results).length} Arabic descriptions`);
