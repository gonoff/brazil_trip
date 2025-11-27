const sharp = require('sharp');
const path = require('path');

const iconsDir = '/home/deck/Documents/brazil_trip/public/icons';

// SVG template for Brazil-themed icon (Earthy palette)
const generateSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Cream background with rounded corners -->
  <rect width="${size}" height="${size}" fill="#F5F0E8" rx="${size * 0.18}"/>

  <!-- Terracotta border/frame -->
  <rect x="${size * 0.04}" y="${size * 0.04}" width="${size * 0.92}" height="${size * 0.92}" fill="none" stroke="#C45C32" stroke-width="${size * 0.03}" rx="${size * 0.14}"/>

  <!-- Forest green diamond (Brazil flag inspired) -->
  <polygon points="${size/2},${size*0.18} ${size*0.82},${size/2} ${size/2},${size*0.82} ${size*0.18},${size/2}" fill="#2D5A3D"/>

  <!-- Golden ochre circle in center -->
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.20}" fill="#C9A227"/>

  <!-- Stylized "B" or plane silhouette in cream -->
  <g transform="translate(${size/2}, ${size/2})">
    <!-- Simple plane/travel icon -->
    <path d="M${-size*0.08},${-size*0.02} L${size*0.08},${-size*0.02} L${size*0.12},0 L${size*0.08},${size*0.02} L${-size*0.08},${size*0.02} L${-size*0.12},0 Z" fill="#F5F0E8"/>
    <circle cx="0" cy="0" r="${size*0.03}" fill="#F5F0E8"/>
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

  // Favicon (32x32) - save to public root
  const faviconSvg = Buffer.from(generateSVG(32));
  await sharp(faviconSvg).png().toFile(path.join(iconsDir, '..', 'favicon.png'));
  console.log('Created favicon.png');

  // Also create a 16x16 for ico
  const favicon16 = Buffer.from(generateSVG(16));
  await sharp(favicon16).png().toFile(path.join(iconsDir, '..', 'favicon-16x16.png'));
  console.log('Created favicon-16x16.png');

  // 32x32 version
  const favicon32 = Buffer.from(generateSVG(32));
  await sharp(favicon32).png().toFile(path.join(iconsDir, '..', 'favicon-32x32.png'));
  console.log('Created favicon-32x32.png');
}

convert().catch(console.error);
