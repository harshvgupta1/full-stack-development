import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const CONFIG = {
  startDate: "2026-08-17", // Day 1 = Monday 17 Aug 2026 (fresh start)
  firstDayStartFrom: null, // Full day slots from Day 1
  email: "harsh.gupta@getreelax.com",
  name: "Harsh Vardhan Gupta",
  timezone: "Asia/Kolkata",
  totalDays: 182,
  weekdaySlots: [
    { label: "Evening 1", start: "19:30", end: "20:30" },
    { label: "Evening 2", start: "21:00", end: "22:00" },
  ],
  weekendSlots: [
    { label: "Morning", start: "09:00", end: "12:00" },
    { label: "Afternoon", start: "15:00", end: "17:30" },
    { label: "Evening", start: "18:00", end: "20:30" },
  ],
};

const PDF_DAY_RANGES = [
  { file: "00b-html-css-web-fundamentals-complete.md", start: 29, end: 30, title: "HTML/CSS Web Fundamentals" },
  { file: "01-javascript-complete.md", start: 1, end: 21, title: "JavaScript Complete" },
  { file: "02-typescript-complete.md", start: 22, end: 28, title: "TypeScript Complete" },
  { file: "00-git-complete.md", start: 22, end: 28, title: "Git Complete" },
  { file: "08b-dsa-datastructures-fundamentals-complete.md", start: 1, end: 112, title: "DSA Data Structures (parallel)" },
  { file: "03-react-complete.md", start: 29, end: 49, title: "React Complete" },
  { file: "04-nextjs-complete.md", start: 50, end: 56, title: "Next.js Complete" },
  { file: "05-nodejs-express-complete.md", start: 57, end: 63, title: "Node.js & Express" },
  { file: "07-auth-devops-complete.md", start: 64, end: 70, title: "Auth & DevOps" },
  { file: "06-databases-complete.md", start: 71, end: 84, title: "Databases (Mongo, PG, MySQL, Redis)" },
  { file: "10b-networking-http-fundamentals-complete.md", start: 78, end: 84, title: "Networking & HTTP" },
  { file: "08-dsa-patterns-complete.md", start: 113, end: 126, title: "DSA Patterns" },
  { file: "09-lld-complete.md", start: 119, end: 140, title: "LLD Complete" },
  { file: "14-advanced-dsa-hard-complete.md", start: 127, end: 140, title: "Advanced DSA Hard" },
  { file: "15-machine-coding-complete.md", start: 118, end: 140, title: "Machine Coding" },
  { file: "10c-system-design-prerequisites-complete.md", start: 141, end: 143, title: "SD Prerequisites" },
  { file: "10-system-design-complete.md", start: 141, end: 154, title: "System Design Complete" },
  { file: "11-distributed-systems-complete.md", start: 145, end: 158, title: "Distributed Systems" },
  { file: "12-microservices-kafka-complete.md", start: 151, end: 162, title: "Microservices & Kafka" },
  { file: "13-kubernetes-cloud-advanced-complete.md", start: 155, end: 165, title: "Kubernetes & Cloud" },
  { file: "16-behavioral-senior-complete.md", start: 141, end: 182, title: "Behavioral (Senior)" },
  { file: "17-interview-qa-80lpa-master.md", start: 1, end: 182, title: "Interview Q&A (tiered)" },
  { file: "18-80lpa-roadmap-addendum.md", start: 1, end: 182, title: "80 LPA Roadmap Addendum" },
  { file: "19-phases-678-easy-to-hard-complete.md", start: 113, end: 182, title: "Phases 6–8 Easy→Hard" },
  { file: "20-1cr-product-company-complete.md", start: 113, end: 182, title: "1 CR Product-Company Guide" },
  { file: "21-1cr-remaining-gaps-complete.md", start: 1, end: 182, title: "1 CR Remaining Gaps + MERN Verdict" },
  { file: "22-top-100-recruitment-processes-complete.md", start: 167, end: 182, title: "Top 100 Recruitment Processes" },
  { file: "23-top-product-companies-interview-100.md", start: 1, end: 182, title: "Top Product Companies Interview 100" },
  { file: "week-01-javascript-exercises-complete.md", start: 1, end: 7, title: "Week 1 JS Exercises" },
  { file: "week-02-javascript-exercises-complete.md", start: 8, end: 14, title: "Week 2 JS Exercises" },
  { file: "week-03-javascript-exercises-complete.md", start: 15, end: 21, title: "Week 3 JS Exercises" },
  { file: "week-04-typescript-exercises-complete.md", start: 22, end: 28, title: "Week 4 TS Exercises" },
  { file: "month-02-frontend-exercises-complete.md", start: 29, end: 56, title: "Month 2 Frontend Exercises" },
  { file: "month-03-backend-exercises-complete.md", start: 57, end: 84, title: "Month 3 Backend Exercises" },
  { file: "month-04-project-exercises-complete.md", start: 85, end: 112, title: "Month 4 Project Exercises" },
  { file: "month-05-dsa-lld-exercises-complete.md", start: 113, end: 140, title: "Month 5 DSA/LLD Exercises" },
  { file: "month-06-interview-exercises-complete.md", start: 141, end: 182, title: "Month 6 Interview Exercises" },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function addDays(base, n) {
  const d = new Date(base + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d;
}

function formatDate(d) {
  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  const dow = DAY_NAMES[d.getDay()];
  return { iso: d.toISOString().slice(0, 10), display: `${dow}, ${day} ${month} ${year}`, short: `${day} ${month} ${year}`, dow };
}

function isWeekend(d) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function getSlotsForDay(dayIndex) {
  const weekend = isWeekend(addDays(CONFIG.startDate, dayIndex));
  let slots = weekend ? [...CONFIG.weekendSlots] : [...CONFIG.weekdaySlots];
  if (dayIndex === 0 && CONFIG.firstDayStartFrom) {
    slots = slots.filter((s) => s.start >= CONFIG.firstDayStartFrom);
  }
  return slots;
}

function parseField(block, field) {
  const re = new RegExp(`\\*\\*${field}\\*\\* \\| (.+)`);
  const m = block.match(re);
  return m ? m[1].trim() : "";
}

function parseDaysFromRoadmap(content) {
  const parts = content.split(/^### Day /m).slice(1);
  return parts.map((part) => {
    const num = parseInt(part.match(/^(\d+)/)[1], 10);
    const block = "### Day " + part;
    return {
      day: num,
      topic: parseField(block, "Exact Topic"),
      theoryFile: parseField(block, "Theory File"),
      theorySection: parseField(block, "Theory Section"),
      exercises: parseField(block, "Specific Exercises"),
      leetcode: parseField(block, "LeetCode"),
      project: parseField(block, "Weekend / Project Tasks"),
    };
  });
}

function icsDate(dateIso, time) {
  return dateIso.replace(/-/g, "") + "T" + time.replace(":", "") + "00";
}

function buildIcsEvent({ uid, dateIso, start, end, summary, description, slots }) {
  const slotText = slots.map((s) => `${s.label}: ${s.start}–${s.end}`).join(" · ");
  const fullDesc = `${description}\\n\\nTime slots (IST): ${slotText}\\n\\nEmail: ${CONFIG.email}`;
  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${icsDate(new Date().toISOString().slice(0, 10), "12:00")}`,
    `DTSTART;TZID=${CONFIG.timezone}:${icsDate(dateIso, start)}`,
    `DTEND;TZID=${CONFIG.timezone}:${icsDate(dateIso, end)}`,
    `SUMMARY:${summary.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${fullDesc.replace(/\n/g, "\\n")}`,
    `ORGANIZER;CN=${CONFIG.name}:mailto:${CONFIG.email}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${CONFIG.email}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    "DESCRIPTION:MERN Mastery — starting in 30 minutes",
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT10M",
    "ACTION:DISPLAY",
    "DESCRIPTION:MERN Mastery — starting in 10 minutes",
    "END:VALARM",
    "END:VEVENT",
  ].join("\r\n");
}

function buildScheduleBanner(range) {
  const start = formatDate(addDays(CONFIG.startDate, range.start - 1));
  const end = formatDate(addDays(CONFIG.startDate, range.end - 1));
  return [
    "> **📅 Study window:** " + `${start.short} – ${end.short} (Days ${range.start}–${range.end})`,
    "> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**",
    `> **📧 Calendar reminders:** ${CONFIG.email} — import \`calendar/mern-mastery-study.ics\``,
    "",
  ].join("\n");
}

async function injectPdfBanners() {
  for (const range of PDF_DAY_RANGES) {
    const paths = [
      join(root, "detailed", "theory", range.file),
      join(root, "detailed", "exercises", range.file),
    ];
    const banner = buildScheduleBanner(range);
    const markerStart = "<!-- SCHEDULE-BANNER-START -->";
    const markerEnd = "<!-- SCHEDULE-BANNER-END -->";
    const wrapped = `${markerStart}\n${banner}${markerEnd}`;

    for (const p of paths) {
      try {
        let content = await readFile(p, "utf8");
        if (content.includes(markerStart)) {
          content = content.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}\\n?`), wrapped + "\n");
        } else {
          const lines = content.split("\n");
          const h1Index = lines.findIndex((l) => l.startsWith("# "));
          if (h1Index >= 0) {
            let insertAt = h1Index + 1;
            if (lines[insertAt]?.startsWith(">")) {
              while (insertAt < lines.length && (lines[insertAt].startsWith(">") || lines[insertAt].trim() === "")) insertAt++;
            }
            lines.splice(insertAt, 0, "", wrapped);
            content = lines.join("\n");
          }
        }
        await writeFile(p, content);
      } catch {
        /* file may not exist in both dirs */
      }
    }
  }
}

async function updateRoadmap(dayPlans, dates) {
  let content = await readFile(join(root, "detailed", "00-ROADMAP-COMPLETE.md"), "utf8");

  content = content.replace(
    /\*\*Start Date\*\* \| \*\*[^|]+\*\* \(Day 1\)/,
    `**Start Date** | **${dates[0].display}** (Day 1)`
  );
  content = content.replace(
    /\*\*Expected End Date\*\* \| \*\*[^|]+\*\* \(Day 182\)/,
    `**Expected End Date** | **${dates[181].display}** (Day 182)`
  );

  const milestoneDays = [7, 28, 28, 56, 56, 70, 84, 84, 98, 112, 112, 112, 140, 140, 168, 168, 168, 173, 175, 182];
  let mi = 0;
  content = content.replace(/\| (\d+) \| \| \[ \]/g, (match, milestoneNum) => {
    const day = milestoneDays[mi++];
    if (day && dates[day - 1]) {
      return `| ${milestoneNum} | ${dates[day - 1].short} | [ ]`;
    }
    return match;
  });

  content = content.replace(
    /\*\*Daily Commitment\*\* \| 2 hours Mon–Fri · 8 hours Sat–Sun/,
    "**Daily Commitment** | Mon–Fri: 7:30–8:30pm + 9–10pm · Sat–Sun: 9am–12pm + 3–5:30pm + 6–8:30pm"
  );

  content = content.replace(/\| \*\*Study Date\*\* \|[^\n]+\n/g, "");
  content = content.replace(/\| \*\*Time Slots \(IST\)\*\* \|[^\n]+\n/g, "");
  content = content.replace(/\| \*\*Calendar\*\* \|[^\n]+\n/g, "");

  for (let i = 0; i < dayPlans.length; i++) {
    const plan = dayPlans[i];
    const date = dates[i];
    const slots = getSlotsForDay(i);
    const slotStr = slots.map((s) => `${s.start}–${s.end}`).join(" · ");
    const hours = isWeekend(addDays(CONFIG.startDate, i)) ? "8 hours" : "2 hours";
    const day1Note = i === 0 && CONFIG.firstDayStartFrom ? " · **First session 3:00pm**" : "";

    const headerRe = new RegExp(`(### Day ${plan.day} — )[^\\n]+`, "m");
    content = content.replace(headerRe, `$1${date.dow} | 📅 ${date.short} | ${hours}${day1Note}`);

    const dayBlockRe = new RegExp(
      `(### Day ${plan.day} — [^\\n]+\\n\\n\\| Field \\| Detail \\|\\n\\|[-|]+\\|\\n)`,
      "m"
    );
    const startNote = i === 0 && CONFIG.firstDayStartFrom ? " (starts 3pm — morning skipped)" : "";
    const injection = `$1| **Study Date** | **${date.display}**${startNote} |\n| **Time Slots (IST)** | ${slotStr} |\n| **Calendar** | Day ${plan.day} in \`calendar/mern-mastery-study.ics\` |\n`;
    content = content.replace(dayBlockRe, injection);
  }

  await writeFile(join(root, "detailed", "00-ROADMAP-COMPLETE.md"), content);
}

async function writeScheduleMd(dayPlans, dates) {
  const lines = [
    "# MERN Mastery — Dated Study Schedule",
    "",
    `**Student:** ${CONFIG.name}`,
    `**Email:** ${CONFIG.email}`,
    `**Start:** ${dates[0].display} (Day 1 — evening slots 7:30–8:30pm · 9:00–10:00pm)`,
    `**End:** ${dates[181].display} (Day 182)`,
    "",
    "## Your time slots (IST)",
    "",
    "| Days | Slots |",
    "|------|-------|",
    "| Mon–Fri | 7:30–8:30pm · 9:00–10:00pm |",
    "| Sat–Sun | 9:00am–12:00pm · 3:00–5:30pm · 6:00–8:30pm |",
    "",
    "## Import calendar reminders",
    "",
    "1. Open [Google Calendar](https://calendar.google.com)",
    "2. **Settings → Import & export → Import**",
    "3. Select `calendar/mern-mastery-study.ics`",
    "4. Enable **Email notifications** for events (Settings → Notifications)",
    "",
    "---",
    "",
    "## Day-by-day schedule",
    "",
    "| Day | Date | Topic | PDF / Theory |",
    "|-----|------|-------|--------------|",
  ];

  for (let i = 0; i < dayPlans.length; i++) {
    const p = dayPlans[i];
    const d = dates[i];
    const theory = p.theoryFile.replace(/\[`([^`]+)`\].*/, "$1").replace(/.*\//, "") || "—";
    lines.push(`| ${p.day} | ${d.short} (${d.dow}) | ${p.topic.slice(0, 50)}${p.topic.length > 50 ? "…" : ""} | ${theory} |`);
  }

  await writeFile(join(root, "detailed", "00-SCHEDULE-DATED.md"), lines.join("\n") + "\n");
}

async function writeIcs(dayPlans, dates) {
  const events = [];
  for (let i = 0; i < dayPlans.length; i++) {
    const plan = dayPlans[i];
    const date = dates[i];
    const slots = getSlotsForDay(i);
    const summary = `MERN Day ${plan.day}: ${plan.topic.slice(0, 60)}`;
    const description = [
      `Day ${plan.day} — ${plan.topic}`,
      plan.theorySection ? `Theory: ${plan.theorySection}` : "",
      plan.exercises ? `Exercises: ${plan.exercises}` : "",
      plan.leetcode && plan.leetcode !== "None" ? `LeetCode: ${plan.leetcode}` : "",
      plan.project && plan.project !== "None" ? `Project: ${plan.project}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    for (const slot of slots) {
      events.push(
        buildIcsEvent({
          uid: `mern-mastery-v5-day${plan.day}-${slot.label.replace(/\s/g, "").toLowerCase()}@getreelax.com`,
          dateIso: date.iso,
          start: slot.start,
          end: slot.end,
          summary: `${summary} (${slot.label})`,
          description,
          slots,
        })
      );
    }
  }

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MERN Mastery//Study Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:MERN Mastery — 80 LPA Prep",
    "X-WR-TIMEZONE:Asia/Kolkata",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Kolkata",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0530",
    "TZOFFSETTO:+0530",
    "TZNAME:IST",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  await mkdir(join(root, "calendar"), { recursive: true });
  await writeFile(join(root, "calendar", "mern-mastery-study.ics"), ics);
}

async function writeConfig(dates) {
  await writeFile(
    join(root, "schedule-config.json"),
    JSON.stringify({ ...CONFIG, endDate: dates[181].iso, pdfRanges: PDF_DAY_RANGES }, null, 2)
  );
}

async function updateLearningPath(dates) {
  const p = join(root, "detailed", "theory", "00-LEARNING-PATH-COMPLETE.md");
  let content = await readFile(p, "utf8");
  const markerStart = "<!-- SCHEDULE-BANNER-START -->";
  const markerEnd = "<!-- SCHEDULE-BANNER-END -->";
  const banner = [
    markerStart,
    "> **📅 Program dates:** " + `${dates[0].short} → ${dates[181].short} (182 days)`,
    "> **⏰ Slots (IST):** Mon–Fri 7:30–8:30pm & 9–10pm · Sat–Sun 9am–12pm, 3–5:30pm, 6–8:30pm",
    `> **📧 Reminders:** Import \`calendar/mern-mastery-study.ics\` → ${CONFIG.email}`,
    "",
    markerEnd,
  ].join("\n");

  content = content.replace(
    /(?:<!-- SCHEDULE-BANNER-START -->[\s\S]*?<!-- SCHEDULE-BANNER-END -->\n?)+/,
    ""
  );
  content = content.replace(
    /(?:> \*\*📅 Program dates:\*\*[^\n]*\n> \*\*⏰ Slots \(IST\):\*\*[^\n]*\n> \*\*📧 Reminders:\*\*[^\n]*\n)+/g,
    ""
  );

  if (content.includes(markerStart)) {
    content = content.replace(
      new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}\\n?`),
      banner + "\n"
    );
  } else {
    content = content.replace(/^(# Master Learning Path[^\n]*\n)/, `$1\n${banner}\n`);
  }
  await writeFile(p, content);
}

async function main() {
  const roadmap = await readFile(join(root, "detailed", "00-ROADMAP-COMPLETE.md"), "utf8");
  const dayPlans = parseDaysFromRoadmap(roadmap);
  const dates = dayPlans.map((_, i) => formatDate(addDays(CONFIG.startDate, i)));

  console.log(`Schedule: ${dates[0].display} → ${dates[181].display}`);
  console.log(`Email: ${CONFIG.email}`);
  console.log(`Days parsed: ${dayPlans.length}`);

  await updateRoadmap(dayPlans, dates);
  await writeScheduleMd(dayPlans, dates);
  await writeIcs(dayPlans, dates);
  await writeConfig(dates);
  await updateLearningPath(dates);
  await injectPdfBanners();

  console.log("\nCreated:");
  console.log("  calendar/mern-mastery-study.ics");
  console.log("  detailed/00-SCHEDULE-DATED.md");
  console.log("  schedule-config.json");
  console.log("  Updated roadmap + PDF source banners");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
