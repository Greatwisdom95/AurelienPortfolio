const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const videosToOptimize = [
    {
        input: 'public/assets/videos/AR-3D/5B2ECB90-3246-4ACA-875E-474480F6AA4F.mp4',
        output: 'public/assets/videos/AR-3D/ar-3d-optimized.mp4'
    },
    {
        input: 'public/assets/videos/FoodBrand/Mr%20%26%20Mrs%20Fries/1A54FC2C-6C0C-4A94-B579-B8D862F92921.MP4', // Note: Need to handle URL encoded path if file system has spaces
        fileSystemInput: 'public/assets/videos/FoodBrand/Mr & Mrs Fries/1A54FC2C-6C0C-4A94-B579-B8D862F92921.MP4',
        output: 'public/assets/videos/FoodBrand/Mr & Mrs Fries/fries-optimized.mp4'
    },
    {
        input: 'public/assets/videos/FullStackWebsite/jolisite website (1).mp4',
        output: 'public/assets/videos/FullStackWebsite/website-optimized.mp4'
    },
    {
        input: 'public/assets/videos/FeaturedCLIENTImmorose/Logo immorose animation/084FEDFC-0985-4CFC-A52D-104CA7011B9D (1).mp4',
        output: 'public/assets/videos/FeaturedCLIENTImmorose/Logo immorose animation/immorose-optimized.mp4'
    },
    {
        input: 'public/assets/videos/FeaturedCLIENTImmorose/Logo Miroir mall animation/6E81B99B-68FD-4636-8543-679E9172DBF8.mp4',
        output: 'public/assets/videos/FeaturedCLIENTImmorose/Logo Miroir mall animation/miroirmall-optimized.mp4'
    }
];

// Helper to handle both simple and complex paths
videosToOptimize.forEach(video => {
    const inputPath = video.fileSystemInput || video.input;
    const absInput = path.resolve(inputPath);
    const absOutput = path.resolve(video.output);

    if (!fs.existsSync(absInput)) {
        console.error(`Input file not found: ${absInput}`);
        return;
    }

    console.log(`Starting processing: ${path.basename(absInput)}`);
    console.log(`Output: ${path.basename(absOutput)}`);

    ffmpeg(absInput)
        .outputOptions([
            '-vcodec libx264',
            '-crf 28',         // Higher CRF = higher compression, lower quality. 28 is good balance for web
            '-preset veryfast',
            '-an'              // Remove audio to save space (since mostly muted anyway)
        ])
        .save(absOutput)
        .on('end', () => {
            console.log(`Finished processing: ${path.basename(absOutput)}`);
        })
        .on('error', (err) => {
            console.error(`Error processing ${path.basename(absInput)}:`, err.message);
        });
});
