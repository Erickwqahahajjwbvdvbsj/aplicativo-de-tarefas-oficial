import fs from 'fs';
import https from 'https';

const url = 'https://iili.io/C7RO0zv.png';

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: ${res.statusCode}`);
    return;
  }
  
  const chunks = [];
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync('public/icon-192.png', buffer);
    fs.writeFileSync('public/icon-512.png', buffer);
    console.log(`Icons saved! Size: ${buffer.length} bytes`);
  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
