import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = './public/assets/Images';

async function convertToWebP(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .webp({ quality: 90 })  // 90% quality = visually lossless
            .toFile(outputPath);

        const inputStats = fs.statSync(inputPath);
        const outputStats = fs.statSync(outputPath);
        const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

        console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
        console.log(`   ${(inputStats.size / 1024 / 1024).toFixed(2)}MB → ${(outputStats.size / 1024 / 1024).toFixed(2)}MB (${savings}% saved)`);
    } catch (error) {
        console.error(`❌ Error converting ${inputPath}:`, error.message);
    }
}

async function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await processDirectory(fullPath);
        } else if (entry.name.toLowerCase().endsWith('.png')) {
            const outputPath = fullPath.replace(/\.png$/i, '.webp');
            await convertToWebP(fullPath, outputPath);
        }
    }
}

console.log('🔄 Converting PNG images to WebP...\n');

processDirectory(imagesDir)
    .then(() => {
        console.log('\n🎉 Conversion complete!');
    })
    .catch(console.error);
