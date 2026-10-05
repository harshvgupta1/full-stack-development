const puppeteer = require('../mern-mastery/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const htmlPath = path.join(__dirname, 'index.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  const destPath = path.join(__dirname, 'Harsh_Vardhan_Gupta_Resume.pdf');
  await page.pdf({
    path: destPath,
    format: 'A4',
    printBackground: true,
    pageRanges: '1',
    preferCSSPageSize: true
  });

  await browser.close();
  console.log('Successfully generated PDF at ' + destPath);

  // Copy to user Downloads folder
  const downloadsPath = path.join('/Users/reelax/Downloads', 'Harsh_Vardhan_Gupta_Resume.pdf');
  try {
    fs.copyFileSync(destPath, downloadsPath);
    console.log('Successfully copied PDF to ' + downloadsPath);
  } catch (err) {
    console.error('Failed to copy to Downloads folder:', err.message);
  }
}

generatePDF().catch(console.error);
