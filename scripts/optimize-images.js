const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public');

async function run() {
  const source = path.join(publicDir, 'costarica-beach.jpg');

  if (!fs.existsSync(source)) {
    console.log('Source image not found, skipping optimization.');
    return;
  }

  // Hero background — resized to 1920×1080, WebP quality 75
  const heroOut = path.join(publicDir, 'costarica-beach.webp');
  await sharp(source)
    .resize(1920, 1080, { fit: 'cover', position: 'centre' })
    .webp({ quality: 75 })
    .toFile(heroOut);
  console.log('✓ costarica-beach.webp written');

  // Open Graph image — 1200×630 crop
  const ogOut = path.join(publicDir, 'og-image.jpg');
  await sharp(source)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(ogOut);
  console.log('✓ og-image.jpg written');
}

run().catch((err) => {
  console.error('Image optimization failed:', err);
  process.exit(1);
});
