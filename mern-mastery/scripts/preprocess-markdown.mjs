/**
 * Adds "Line-by-line explanation" tables after code blocks that have
 * trailing // comments on each meaningful line.
 *
 * Also processes blocks marked with <!-- line-explain --> before the fence.
 */

function escapeCell(text) {
  return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function extractLineExplanation(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("//") && !trimmed.includes("`")) {
    return null;
  }
  const commentIdx = line.indexOf("//");
  if (commentIdx === -1) return null;

  const codePart = line.slice(0, commentIdx).trimEnd();
  const explanation = line.slice(commentIdx + 2).trim();
  if (!codePart || !explanation) return null;

  return { code: codePart, explanation };
}

function buildTableFromCode(code, lang) {
  const lines = code.split("\n");
  const rows = [];

  for (const line of lines) {
    const parsed = extractLineExplanation(line);
    if (parsed) {
      rows.push(`| \`${escapeCell(parsed.code)}\` | ${parsed.explanation} |`);
    }
  }

  if (rows.length < 2) return null;

  const langLabel = lang ? ` (${lang})` : "";
  return (
    `\n\n**Line-by-line explanation${langLabel}**\n\n` +
    "| Line | What it does |\n|------|-------------|\n" +
    rows.join("\n") +
    "\n"
  );
}

function enhanceCodeFence(full, marker, lang, code) {
  if (full.includes("**Line-by-line explanation**")) return full;
  const table = buildTableFromCode(code, lang);
  if (!table) return full;
  return full + table;
}

function processMarkedBlocks(content) {
  return content.replace(
    /<!-- line-explain -->\s*\n```(\w*)\n([\s\S]*?)```/g,
    (full, lang, code) => enhanceCodeFence(full, "line-explain", lang, code)
  );
}

function processCompleteSolutions(content) {
  const marker = "**Complete Solution**";
  let idx = 0;
  let result = "";

  while (idx < content.length) {
    const start = content.indexOf(marker, idx);
    if (start === -1) {
      result += content.slice(idx);
      break;
    }

    result += content.slice(idx, start + marker.length);

    const afterHeader = start + marker.length;
    const nextSection = content.slice(afterHeader).search(/\n\*\*(Expected output|Where to practice|Common mistakes|80 LPA|Interview connection|Time estimate|Line-by-line)/);
    const sectionEnd = nextSection === -1 ? content.length : afterHeader + nextSection;
    let section = content.slice(afterHeader, sectionEnd);

    section = section.replace(/```(\w*)\n([\s\S]*?)```/g, (full, lang, code) =>
      enhanceCodeFence(full, "solution", lang, code)
    );

    result += section;
    idx = sectionEnd;
  }

  return result;
}

function mdInline(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function wrapScheduleBanners(content) {
  return content.replace(
    /<!-- SCHEDULE-BANNER-START -->([\s\S]*?)<!-- SCHEDULE-BANNER-END -->/g,
    (_, inner) => {
      const html = inner
        .split("\n")
        .map((line) => line.replace(/^>\s?/, "").trim())
        .filter((line) => line && !line.startsWith("<!--"))
        .map((line) => `<p>${mdInline(line)}</p>`)
        .join("");
      return `<div class="schedule-banner">${html}</div>`;
    }
  );
}

export function preprocessMarkdown(content) {
  let out = content;
  out = wrapScheduleBanners(out);
  out = processMarkedBlocks(out);
  out = processCompleteSolutions(out);
  return out;
}
