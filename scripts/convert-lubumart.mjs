import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const lubumartDir = './public/assets/Images/ClothesBrand/LubumArt';

async function convertToWebP(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .webp({ quality: 90 })
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

const filesToConvert = [
    'LubumArt_Fashion_01.png',
    'LubumArt_Fashion_02.png',
    'LubumArt_Fashion_03.png'
];

console.log('🔄 Converting new LubumArt images to WebP...\n');

for (const file of filesToConvert) {
    const inputPath = path.join(lubumartDir, file);
    const outputPath = inputPath.replace('.png', '.webp');
    await convertToWebP(inputPath, outputPath);
}

console.log('\n🎉 Conversion complete!');
