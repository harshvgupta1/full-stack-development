const puppeteer = require('../mern-mastery/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

function parseResumeText(txt) {
  const lines = txt.split('\n').map(l => l.trimEnd());
  // Basic structure extraction
  let name = lines[0] || 'Harsh Vardhan Gupta';
  let contact = lines[1] || '';
  let links = [];
  
  let i = 2;
  while (i < lines.length && !lines[i].startsWith('---') && !lines[i].match(/^[A-Z\s]{4,}$/)) {
    const line = lines[i].trim();
    if (line.startsWith('LinkedIn:') || line.startsWith('GitHub:') || line.startsWith('Portfolio:')) {
      const parts = line.split(':');
      const label = parts[0].trim();
      const url = parts.slice(1).join(':').trim();
      links.push({ label, url });
    } else if (line.length > 0) {
      // could be extra contact line
      if (!contact) contact = line;
      else contact += ' · ' + line;
    }
    i++;
  }

  // Parse remaining sections divided by --- or ALL CAPS headers
  const sections = [];
  let currentSection = null;

  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '---' || line === '') continue;

    if (line.match(/^[A-Z\s&]{3,}$/) && !line.startsWith('-')) {
      // Section header
      currentSection = { title: line, items: [] };
      sections.push(currentSection);
    } else if (currentSection) {
      currentSection.items.push(line);
    }
  }

  return { name, contact, links, sections };
}

function buildHTML(data) {
  const { name, contact, links, sections } = data;

  let linksHTML = links.map(l => `<a href="${l.url}" target="_blank">${l.label}</a>`).join(' <span class="divider">·</span> ');

  let sectionsHTML = '';

  for (const sec of sections) {
    const title = sec.title.toUpperCase();
    let bodyHTML = '';

    if (title === 'PROFESSIONAL SUMMARY' || title === 'SUMMARY') {
      const summaryText = sec.items.join(' ');
      bodyHTML = `<p>${summaryText}</p>`;
    } else if (title === 'LANGUAGES') {
      const langText = sec.items.join(' ');
      bodyHTML = `<p>${langText}</p>`;
    } else if (title === 'EDUCATION') {
      const eduLines = sec.items;
      bodyHTML = eduLines.map(line => {
        const parts = line.split('·').map(p => p.trim());
        if (parts.length >= 2) {
          const degreeCollege = parts.slice(0, parts.length - 2).join(' <span class="divider">·</span> ') || parts[0];
          const year = parts[parts.length - 2] || '';
          const gpa = parts[parts.length - 1] || '';
          return `<div class="education-row">
            <span><strong>${parts[0]}</strong> <span class="divider">·</span> ${parts.slice(1, parts.length - 2).join(' <span class="divider">·</span> ') || parts[1] || ''}</span>
            <span>${year} <span class="divider">·</span> ${gpa}</span>
          </div>`;
        }
        return `<p>${line}</p>`;
      }).join('\n');
    } else if (title === 'TECHNICAL SKILLS' || title === 'SKILLS') {
      const skillItems = sec.items.map(item => {
        const cleaned = item.replace(/^-\s*/, '');
        const colonIdx = cleaned.indexOf(':');
        if (colonIdx !== -1) {
          const cat = cleaned.slice(0, colonIdx);
          const vals = cleaned.slice(colonIdx + 1);
          return `<li><strong>${cat}:</strong>${vals}</li>`;
        }
        return `<li>${cleaned}</li>`;
      });
      bodyHTML = `<ul class="skills-list">${skillItems.join('\n')}</ul>`;
    } else if (title === 'WORK EXPERIENCE' || title === 'EXPERIENCE') {
      let currentJob = null;
      let jobs = [];

      for (const item of sec.items) {
        if (!item.startsWith('-')) {
          const parts = item.split('·').map(p => p.trim());
          const roleCompany = parts.slice(0, parts.length - 2).join(' <span class="divider">·</span> ') || parts[0];
          const location = parts[parts.length - 2] || '';
          const date = parts[parts.length - 1] || '';
          currentJob = {
            roleCompany,
            meta: `${location} <span class="divider">·</span> ${date}`,
            bullets: []
          };
          jobs.push(currentJob);
        } else if (currentJob) {
          currentJob.bullets.push(item.replace(/^-\s*/, ''));
        }
      }

      bodyHTML = jobs.map(j => `
        <div class="job-header">
          <span class="job-title">${j.roleCompany}</span>
          <span class="job-meta">${j.meta}</span>
        </div>
        <ul>
          ${j.bullets.map(b => `<li>${b}</li>`).join('\n')}
        </ul>
      `).join('\n');
    } else if (title === 'KEY PROJECTS' || title === 'PROJECTS') {
      let currentProject = null;
      let projects = [];

      for (const item of sec.items) {
        if (!item.startsWith('-')) {
          const parts = item.split('·').map(p => p.trim());
          const title = parts[0];
          let link = '';
          let stackParts = parts.slice(1);
          if (stackParts.length > 0 && stackParts[stackParts.length - 1].includes('.')) {
            link = stackParts[stackParts.length - 1];
            stackParts = stackParts.slice(0, stackParts.length - 1);
          }
          currentProject = {
            title,
            stack: stackParts.join(' · '),
            link,
            bullets: []
          };
          projects.push(currentProject);
        } else if (currentProject) {
          currentProject.bullets.push(item.replace(/^-\s*/, ''));
        }
      }

      bodyHTML = projects.map(p => `
        <div class="project-item">
          <div class="project-header">
            <span class="project-title">${p.title} ${p.stack ? `<span class="divider">·</span> <span class="project-stack">${p.stack}</span>` : ''}</span>
            ${p.link ? `<span class="links"><a href="https://${p.link.replace(/^https?:\/\//, '')}" target="_blank">${p.link}</a></span>` : ''}
          </div>
          ${p.bullets.length > 0 ? `<ul>${p.bullets.map(b => `<li>${b}</li>`).join('\n')}</ul>` : ''}
        </div>
      `).join('\n');
    } else {
      // Generic section
      bodyHTML = sec.items.map(item => {
        if (item.startsWith('-')) return `<li>${item.replace(/^-\s*/, '')}</li>`;
        return `<p>${item}</p>`;
      }).join('\n');
    }

    sectionsHTML += `
    <section>
      <h2>${sec.title}</h2>
      ${bodyHTML}
    </section>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 11mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      line-height: 1.32;
      font-size: 10.5px;
      -webkit-font-smoothing: antialiased;
    }

    .page-container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      padding: 0;
      background: #ffffff;
    }

    header {
      margin-bottom: 8px;
      border-bottom: 1.2px solid #cbd5e1;
      padding-bottom: 6px;
    }

    h1 {
      font-size: 21px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
      margin-bottom: 2px;
    }

    .contact-info {
      font-size: 10.5px;
      color: #475569;
      margin-bottom: 2px;
    }

    .links {
      font-size: 10.5px;
    }

    .links a {
      color: #2563eb;
      text-decoration: none;
      font-weight: 600;
    }

    .links a:hover {
      text-decoration: underline;
    }

    .divider {
      margin: 0 4px;
      color: #94a3b8;
    }

    section {
      margin-bottom: 7px;
    }

    section:last-child {
      margin-bottom: 0;
    }

    h2 {
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 2px;
      margin-bottom: 4px;
    }

    p {
      color: #334155;
      font-size: 10.5px;
      line-height: 1.35;
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }

    .job-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 11px;
    }

    .job-meta {
      color: #475569;
      font-weight: 500;
      font-size: 10.5px;
    }

    .project-item {
      margin-bottom: 4px;
    }

    .project-item:last-child {
      margin-bottom: 0;
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1px;
    }

    .project-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 10.5px;
    }

    .project-stack {
      color: #475569;
      font-weight: 400;
    }

    ul {
      list-style-type: disc;
      padding-left: 14px;
      margin-bottom: 2px;
    }

    li {
      color: #334155;
      font-size: 10.5px;
      margin-bottom: 1.5px;
      line-height: 1.34;
    }

    li strong {
      color: #0f172a;
    }

    .skills-list li {
      margin-bottom: 2px;
    }

    .education-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 10.5px;
    }

    @media screen {
      body {
        background-color: #f3f4f6;
        padding: 20px;
      }
      .page-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 32px 40px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        border-radius: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <header>
      <h1>${name}</h1>
      <div class="contact-info">${contact}</div>
      <div class="links">${linksHTML}</div>
    </header>
    ${sectionsHTML}
  </div>
</body>
</html>`;
}

async function convertTxtToPdf() {
  // Check text file source (prioritize desktop resume.txt if edited, else workspace)
  const desktopTxt = '/Users/reelax/Desktop/resume.txt';
  const localTxt = path.join(__dirname, 'resume.txt');
  let sourceTxtPath = localTxt;

  if (fs.existsSync(desktopTxt)) {
    const desktopStat = fs.statSync(desktopTxt);
    const localStat = fs.existsSync(localTxt) ? fs.statSync(localTxt) : { mtimeMs: 0 };
    if (desktopStat.mtimeMs > localStat.mtimeMs) {
      sourceTxtPath = desktopTxt;
      // sync back to workspace
      fs.copyFileSync(desktopTxt, localTxt);
    }
  }

  console.log('Reading resume from:', sourceTxtPath);
  const rawText = fs.readFileSync(sourceTxtPath, 'utf8');
  const parsed = parseResumeText(rawText);
  const htmlContent = buildHTML(parsed);

  const htmlPath = path.join(__dirname, 'index.html');
  fs.writeFileSync(htmlPath, htmlContent);

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
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

  // Copy to Downloads & Desktop
  const downloadsPath = '/Users/reelax/Downloads/Harsh_Vardhan_Gupta_Resume.pdf';
  const desktopPath = '/Users/reelax/Desktop/Harsh_Vardhan_Gupta_Resume.pdf';
  try {
    fs.copyFileSync(destPath, downloadsPath);
    fs.copyFileSync(destPath, desktopPath);
    console.log('Successfully copied PDF to Downloads & Desktop');
  } catch (err) {
    console.error('Copy error:', err.message);
  }
}

if (require.main === module) {
  convertTxtToPdf().catch(console.error);
}

module.exports = { convertTxtToPdf };
