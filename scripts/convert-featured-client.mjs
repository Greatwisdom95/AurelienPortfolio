import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const baseDir = './public/assets/Images/FeaturedClientImmorose/Miroir Mall places';

async function convertToWebP(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .webp({ quality: 85 })
            .toFile(outputPath);

        const inputStats = fs.statSync(inputPath);
        const outputStats = fs.statSync(outputPath);
        const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

        console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
        console.log(`   ${(inputStats.size / 1024 / 1024).toFixed(2)}MB → ${(outputStats.size / 1024 / 1024).toFixed(2)}MB (${savings}% saved)`);
        return { input: inputPath, output: outputPath, savings: parseFloat(savings) };
    } catch (error) {
        console.error(`❌ Error converting ${inputPath}:`, error.message);
        return null;
    }
}

async function processDirectory(dirPath) {
    const results = [];
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const subResults = await processDirectory(fullPath);
            results.push(...subResults);
        } else if (file.endsWith('.png')) {
            const outputPath = fullPath.replace('.png', '.webp');
            const result = await convertToWebP(fullPath, outputPath);
            if (result) results.push(result);
        }
    }
    return results;
}

console.log('🔄 Converting Featured Client images to WebP...\n');

const results = await processDirectory(baseDir);

const totalSavings = results.reduce((acc, r) => acc + r.savings, 0) / results.length;
console.log(`\n🎉 Conversion complete! ${results.length} files converted.`);
console.log(`📊 Average savings: ${totalSavings.toFixed(1)}%`);
