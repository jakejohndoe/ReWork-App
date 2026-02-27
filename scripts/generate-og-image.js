const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  try {
    const svgPath = path.join(__dirname, '../public/og-image.svg');
    const pngPath = path.join(__dirname, '../public/og-image.png');

    // Read SVG file
    const svgBuffer = fs.readFileSync(svgPath);

    // Convert SVG to PNG
    await sharp(svgBuffer)
      .png()
      .resize(1200, 630)
      .toFile(pngPath);

    console.log('✅ OG image generated successfully at /public/og-image.png');
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
  }
}

generateOGImage();