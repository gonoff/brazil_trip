const sharp = require('sharp');
const path = require('path');

const iconsDir = '/home/deck/Documents/brazil_trip/public/icons';

// SVG template for Brazil-themed icon
const generateSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#FBBF24" rx="${size * 0.15}"/>
  <polygon points="${size/2},${size*0.15} ${size*0.85},${size/2} ${size/2},${size*0.85} ${size*0.15},${size/2}" fill="#166534"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.22}" fill="#1E40AF"/>
  <g transform="translate(${size/2}, ${size/2}) scale(${size/512})">
    <path d="M-60,-15 L60,-15 L80,0 L60,15 L-60,15 L-80,0 Z M-20,-50 L20,-50 L20,-15 L-20,-15 Z M-20,15 L20,15 L20,50 L-20,50 Z" fill="white" opacity="0.9"/>
  </g>
</svg>`;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function convert() {
  for (const size of sizes) {
    const svg = Buffer.from(generateSVG(size));
    const pngFile = path.join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(svg).png().toFile(pngFile);
    console.log(`Created icon-${size}x${size}.png`);
  }
  
  // Apple touch icon (180x180)
  const appleSvg = Buffer.from(generateSVG(180));
  await sharp(appleSvg).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');
}

convert().catch(console.error);
