import { mdToPdf } from "md-to-pdf";
import { readdir, readFile } from "fs/promises";
import { join, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { preprocessMarkdown } from "./preprocess-markdown.mjs";
import { writeFile, mkdtemp } from "fs/promises";
import { tmpdir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const stylesheet = join(root, "pdf-styles.css");

const chromePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const pdfConfig = {
  stylesheet,
  pdf_options: {
    format: "A4",
    landscape: false,
    preferCSSPageSize: true,
    margin: { top: "24mm", bottom: "18mm", left: "16mm", right: "16mm" },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-size:8px;width:100%;padding:4px 18mm 0;color:#8a7a64;font-family:Avenir Next,Helvetica,sans-serif;display:flex;justify-content:space-between;letter-spacing:.04em;">
      <span>MERN MASTERY</span>
      <span>1 CR PRODUCT PREP</span>
    </div>`,
    footerTemplate: `<div style="font-size:8px;width:100%;padding:0 18mm 4px;color:#8a7a64;font-family:Avenir Next,Helvetica,sans-serif;display:flex;justify-content:space-between;">
      <span>harsh.gupta@getreelax.com</span>
      <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
    </div>`,
  },
  launch_options: {
    executablePath: chromePath,
    timeout: 120000,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
};

async function convertFile(inputPath, outputPath, options = {}) {
  console.log(`Generating: ${basename(outputPath)}`);
  let raw = await readFile(inputPath, "utf8");

  if (options.interviewBank) {
    try {
      const bank = await readFile(options.interviewBank, "utf8");
      raw = raw.replace(/\n---\n\n\*Previous:.*$/s, "");
      raw = raw + "\n\n---\n\n" + bank;
    } catch {
      /* no interview bank yet */
    }
  }

  const processed = preprocessMarkdown(raw);
  const tempDir = await mkdtemp(join(tmpdir(), "mern-pdf-"));
  const tempMd = join(tempDir, basename(inputPath));
  await writeFile(tempMd, processed);
  await mdToPdf({ path: tempMd }, { ...pdfConfig, dest: outputPath });
  await new Promise((r) => setTimeout(r, 400));
}

const INTERVIEW_BANKS = {
  "00b-html-css-web-fundamentals-complete.md": "00b-html-css-interview-50.md",
  "00-git-complete.md": "00-git-interview-50.md",
  "01-javascript-complete.md": "01-javascript-interview-50.md",
  "02-typescript-complete.md": "02-typescript-interview-50.md",
  "03-react-complete.md": "03-react-interview-50.md",
  "04-nextjs-complete.md": "04-nextjs-interview-50.md",
  "05-nodejs-express-complete.md": "05-nodejs-interview-50.md",
  "06-databases-complete.md": "06-databases-interview-50.md",
  "07-auth-devops-complete.md": "07-auth-devops-interview-50.md",
  "08b-dsa-datastructures-fundamentals-complete.md": "08b-dsa-ds-interview-50.md",
  "08-dsa-patterns-complete.md": "08-dsa-patterns-interview-50.md",
  "09-lld-complete.md": "09-lld-interview-50.md",
  "10-system-design-complete.md": "10-system-design-interview-50.md",
  "10b-networking-http-fundamentals-complete.md": "10b-networking-interview-50.md",
  "10c-system-design-prerequisites-complete.md": "10c-sd-prereq-interview-50.md",
  "11-distributed-systems-complete.md": "11-distributed-interview-50.md",
  "12-microservices-kafka-complete.md": "12-kafka-interview-50.md",
  "13-kubernetes-cloud-advanced-complete.md": "13-kubernetes-interview-50.md",
  "14-advanced-dsa-hard-complete.md": "14-advanced-dsa-interview-50.md",
  "15-machine-coding-complete.md": "15-machine-coding-interview-50.md",
  "16-behavioral-senior-complete.md": "16-behavioral-interview-50.md",
};

async function convertDir(inputDir, outputDir, filter) {
  const files = (await readdir(inputDir))
    .filter((f) => f.endsWith(".md"))
    .filter((f) => !filter || filter(f))
    .sort();

  for (const file of files) {
    const name = file.replace(".md", ".pdf");
    const bankName = INTERVIEW_BANKS[file];
    const bankPath = bankName
      ? join(root, "detailed", "interview-banks", bankName)
      : null;
    await convertFile(join(inputDir, file), join(outputDir, name), {
      interviewBank: bankPath,
    });
  }
}

async function main() {
  const mode = process.argv[2] || "all";

  if (mode === "all" || mode === "roadmap") {
    await convertFile(
      join(root, "detailed", "theory", "00-LEARNING-PATH-COMPLETE.md"),
      join(root, "pdf", "00-LEARNING-PATH-COMPLETE.pdf")
    );
    await convertFile(
      join(root, "detailed", "00-ROADMAP-COMPLETE.md"),
      join(root, "pdf", "00-ROADMAP-COMPLETE.pdf")
    );
    await convertFile(
      join(root, "detailed", "00-SCHEDULE-DATED.md"),
      join(root, "pdf", "00-SCHEDULE-DATED.pdf")
    );
  }

  if (mode === "all" || mode === "theory") {
    await convertDir(
      join(root, "detailed", "theory"),
      join(root, "pdf", "theory")
    );
  }

  if (mode === "all" || mode === "exercises") {
    await convertDir(
      join(root, "detailed", "exercises"),
      join(root, "pdf", "exercises")
    );
  }

  console.log("\nDone! PDFs saved in mern-mastery/pdf/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
