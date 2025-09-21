const sharp = require('sharp');
const path = require('path');

async function convertJpgToPng(files: string[]) {
  try {
    if (!files || files.length === 0) {
      console.log('No input files provided. Usage: node convert.js image1.jpg image2.jpg ...');
      return;
    }

    await Promise.all(
      files.map(async (inputPath) => {
        const parsed = path.parse(inputPath);
        const outputPath = path.join(parsed.dir || '.', `${parsed.name}.png`);
        const info = await sharp(inputPath)
          .toFormat('png')
          .toFile(outputPath);
        console.log(`Converted: ${inputPath} -> ${outputPath}`, info);
      })
    );
  } catch (err) {
    console.error('Error converting images:', err);
  }
}

// If run directly via node, accept CLI args as inputs
const cliArgs = process.argv.slice(2);
convertJpgToPng(cliArgs);