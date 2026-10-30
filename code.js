/* Source code viewer: code.html?file=youtube | tabs */

const FILES = {
  youtube: {
    file: "youtube_channel_links.py",
    title: "YouTube Channel Links",
    about: "Collects links to every video on a YouTube channel. Paste the channel URL — get the full list of videos.",
    exe: "YouTube_Channel_Links.exe",
    exeSize: "21.5 MB",
    deps: "pip install yt-dlp",
    libs: ["yt-dlp"],
    notes: [
      [1, 1, "Imports yt-dlp — the library that knows how to talk to YouTube."],
      [4, 5, "Asks for the channel link, strips extra parameters and points it at the channel's Videos tab."],
      [7, 8, "Grabs the list of videos without downloading a single one (extract_flat)."],
      [10, 11, "Prints the link of every video, one per line."],
      [13, 13, "Waits for Enter, so the window doesn't close before you copy the links."],
    ],
  },
  tabs: {
    file: "browser_tab_links.py",
    title: "Browser Tab Links",
    about: "Copies the URLs of all open browser tabs. Enter the number of tabs, switch to your browser — the tool walks through them and prints every link.",
    exe: "Browser_Tab_Links.exe",
    exeSize: "15.2 MB",
    deps: "pip install pyautogui pyperclip",
    libs: ["PyAutoGUI", "pyperclip"],
    notes: [
      [1, 3, "Loads the tools: time for pauses, pyautogui to press keys, pyperclip to read the clipboard."],
      [5, 7, "Asks how many tabs to visit, then gives you 5 seconds to switch to the browser."],
      [10, 11, "Ctrl+L selects the address bar of the current tab."],
      [13, 14, "Ctrl+C copies the URL to the clipboard."],
      [16, 18, "Ctrl+Tab jumps to the next tab, and the copied URL is printed."],
      [20, 21, "Done! Waits for Enter before closing."],
    ],
  },
};

/* ---------- Python syntax highlighting ---------- */
const PY_KEYWORDS = new Set(("and as assert async await break class continue def del elif else except finally for " +
  "from global if import in is lambda nonlocal not or pass raise return try while with yield").split(" "));
const PY_CONSTANTS = new Set(["True", "False", "None"]);
const PY_BUILTINS = new Set("print input int str float range len list dict set open".split(" "));
const PY_TOKEN = /(#.*$)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|(.)/g;

const escapeHtml = text => text.replace(/[&<>"]/g, ch => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[ch]);

function highlight(line) {
  let html = "";
  let prev = "";
  for (const match of line.matchAll(PY_TOKEN)) {
    const [text, comment, string, number, word, space] = match;
    let cls = "tk-punct";
    if (space) cls = "";
    else if (comment) cls = "tk-com";
    else if (string) cls = "tk-str";
    else if (number) cls = "tk-num";
    else if (word) {
      const next = line.slice(match.index + text.length).trimStart()[0];
      if (PY_KEYWORDS.has(word)) cls = "tk-kw";
      else if (PY_CONSTANTS.has(word)) cls = "tk-num";
      else if (prev === ".") cls = next === "(" ? "tk-fn" : "tk-attr";
      else if (PY_BUILTINS.has(word)) cls = "tk-builtin";
      else if (next === "(") cls = "tk-fn";
      else cls = "tk-var";
    }
    let body = escapeHtml(text);
    if (string) body = body.replace(/\\./g, esc => `<span class="tk-esc">${esc}</span>`);
    html += cls ? `<span class="${cls}">${body}</span>` : body;
    if (!space) prev = text;
  }
  return html;
}

/* ---------- helpers ---------- */
async function copyText(text, button, label, done) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.cssText = "position:fixed;opacity:0";
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  const original = label.textContent;
  label.textContent = done;
  button.classList.add("copied");
  setTimeout(() => {
    label.textContent = original;
    button.classList.remove("copied");
  }, 1600);
}

function lineLabel(from, to) {
  return from === to ? `L${from}` : `L${from}–${to}`;
}

/* ---------- page ---------- */
function showNotFound() {
  document.title = "Not found — FENIX";
  document.getElementById("codeTitle").textContent = "File not found";
  document.getElementById("codeAbout").textContent = "There's no such file here. Head back and pick one of the tools.";
  document.getElementById("codeActions").hidden = true;
  document.getElementById("codeLayout").hidden = true;
}

function fillPage(entry) {
  document.title = `${entry.file} — FENIX`;
  document.getElementById("codeTitle").textContent = entry.title;
  document.getElementById("codeAbout").textContent = entry.about;
  document.getElementById("fileName").textContent = entry.file;
  document.getElementById("pyLink").href = `downloads/${entry.file}`;
  document.getElementById("exeLink").href = `downloads/${entry.exe}`;
  document.getElementById("exeSize").textContent = entry.exeSize;

  const runSteps = document.getElementById("runSteps");
  const python = el("li");
  const pythonText = el("span", "", "Install Python 3 from ");
  const pythonLink = el("a", "inline-link", "python.org ↗");
  pythonLink.href = "https://www.python.org/downloads/";
  pythonLink.target = "_blank";
  pythonLink.rel = "noopener";
  pythonText.append(pythonLink);
  python.append(pythonText);
  runSteps.append(python);

  for (const [text, command] of [["Install the libraries", entry.deps], ["Run the script", `python ${entry.file}`]]) {
    const step = el("li");
    const line = el("div", "cmd-line");
    const copy = el("button", "copy-mini");
    const copyLabel = el("span", "", "Copy");
    copy.type = "button";
    copy.setAttribute("aria-label", `Copy: ${command}`);
    copy.append(copyLabel);
    copy.addEventListener("click", () => copyText(command, copy, copyLabel, "Copied ✓"));
    line.append(el("code", "", command), copy);
    step.append(el("span", "", text), line);
    runSteps.append(step);
  }

  const skip = el("li", "run-skip");
  const exe = el("a", "inline-link", `grab the .exe (${entry.exeSize})`);
  exe.href = `downloads/${entry.exe}`;
  exe.setAttribute("download", "");
  skip.append("Or skip all that and ", exe, ".");
  runSteps.append(skip);
}

function buildNotes(entry, rows) {
  const lines = document.getElementById("codeLines");
  const notes = document.getElementById("notes");
  const setFocus = range => {
    lines.classList.toggle("focus-mode", Boolean(range));
    rows.forEach((row, i) => row.classList.toggle("hl", Boolean(range) && i + 1 >= range[0] && i + 1 <= range[1]));
  };

  for (const [from, to, text] of entry.notes) {
    const item = el("li");
    const button = el("button", "note");
    button.type = "button";
    button.append(el("span", "note-lines", lineLabel(from, to)), el("span", "note-text", text));
    button.addEventListener("mouseenter", () => setFocus([from, to]));
    button.addEventListener("focus", () => setFocus([from, to]));
    button.addEventListener("mouseleave", () => setFocus(null));
    button.addEventListener("blur", () => setFocus(null));
    button.addEventListener("click", () => {
      setFocus([from, to]);
      rows[from - 1]?.scrollIntoView({block: "nearest", behavior: reduceMotion ? "auto" : "smooth"});
    });
    item.append(button);
    notes.append(item);
  }
}

async function typeCode(source, rows, status) {
  const lines = source.split("\n");
  const caret = el("span", "code-caret");
  const total = source.length;
  const perFrame = Math.max(2, Math.ceil(total / (2.2 * 60)));
  let skipped = false;
  document.querySelector(".code-window").addEventListener("click", () => { skipped = true; }, {once: true});

  for (let i = 0; i < lines.length; i++) {
    const code = rows[i].querySelector(".ln-code");
    rows[i].classList.add("shown");
    let typed = 0;
    while (typed < lines[i].length && !skipped && !reduceMotion) {
      typed = Math.min(lines[i].length, typed + perFrame);
      code.innerHTML = highlight(lines[i].slice(0, typed));
      code.append(caret);
      status.textContent = `Ln ${i + 1}, Col ${typed + 1}`;
      await new Promise(requestAnimationFrame);
    }
    code.innerHTML = highlight(lines[i]);
    code.append(caret);
    if (!lines[i].length && !skipped && !reduceMotion) await sleep(40);
  }
}

// Over http(s) read the real file; opened from disk (file://) browsers block fetch,
// so fall back to the copy embedded in sources.js.
async function loadSource(file) {
  if (location.protocol.startsWith("http")) {
    try {
      const response = await fetch(`downloads/${file}`);
      if (response.ok) return await response.text();
    } catch {
      // fall through to the embedded copy
    }
  }
  const embedded = window.SOURCES?.[file];
  if (embedded === undefined) throw new Error(`No source for ${file}`);
  return embedded;
}

async function main() {
  const entry = FILES[new URLSearchParams(location.search).get("file")];
  if (!entry) {
    showNotFound();
    return;
  }
  fillPage(entry);

  const status = document.getElementById("statusLeft");
  const linesBox = document.getElementById("codeLines");
  let source;
  try {
    const raw = (await loadSource(entry.file)).replace(/\r\n/g, "\n");
    source = raw.replace(/\n+$/, "");
    // A blob link really downloads the file, even when the page is opened from disk.
    const pyLink = document.getElementById("pyLink");
    pyLink.href = URL.createObjectURL(new Blob([raw], {type: "text/x-python"}));
    pyLink.download = entry.file;
  } catch {
    document.querySelector(".code-status").classList.add("error");
    status.textContent = "couldn't load the file";
    const row = el("li", "shown");
    row.append(el("span", "ln-no", "!"), el("span", "ln-code tk-com", "# Couldn't load the code here — use “Download .py” above."));
    linesBox.append(row);
    return;
  }

  const lineCount = source.split("\n").length;
  const meta = document.getElementById("codeMeta");
  for (const chip of ["Python 3", `${lineCount} lines`, `${(new Blob([source]).size / 1024).toFixed(1)} KB`, ...entry.libs]) {
    meta.append(el("li", "", chip));
  }

  const rows = source.split("\n").map((_, i) => {
    const row = el("li");
    row.append(el("span", "ln-no", String(i + 1)), el("span", "ln-code"));
    linesBox.append(row);
    return row;
  });
  buildNotes(entry, rows);

  const copy = document.getElementById("copyCode");
  copy.addEventListener("click", () => copyText(source, copy, copy.querySelector("span"), "Copied ✓"));

  await sleep(reduceMotion ? 0 : 500);
  await typeCode(source, rows, status);
  status.textContent = `${lineCount} lines · ready`;
}

main();
