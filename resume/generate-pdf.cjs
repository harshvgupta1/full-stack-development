const puppeteer = require('../mern-mastery/node_modules/puppeteer');
const path = require('path');

async function generatePDF() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const htmlPath = path.join(__dirname, 'index.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: path.join(__dirname, 'Harsh_Vardhan_Gupta_Resume.pdf'),
    format: 'A4',
    printBackground: true,
    margin: {
      top: '8mm',
      bottom: '8mm',
      left: '10mm',
      right: '10mm'
    }
  });

  await browser.close();
  console.log('Successfully generated PDF at resume/Harsh_Vardhan_Gupta_Resume.pdf');
}

generatePDF().catch(console.error);
