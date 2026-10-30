/* Builds the project cards from projects.js (window.PROJECTS).
   To add or change a project you don't need this file: use editor.html or edit projects.js. */

const THEMES = {
  cyan: {badge: "", icon: "icon-cyan", button: ""},
  violet: {badge: "badge-violet", icon: "icon-violet", button: "btn-violet"},
  pink: {badge: "badge-pink", icon: "icon-pink", button: "btn-pink"},
  red: {badge: "badge-red", icon: "icon-red", button: ""},
  amber: {badge: "badge-amber", icon: "icon-amber", button: "btn-amber"},
  lime: {badge: "badge-lime", icon: "icon-lime", button: "btn-lime"},
};

const ICONS = {
  youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" class="fill"/>',
  tabs: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 4v5M11 4v5"/>',
  puzzle: '<path d="M9 3h3a2 2 0 1 1 4 0h3v5a2 2 0 1 1 0 4v5h-5a2 2 0 1 0-4 0H5v-5a2 2 0 1 0 0-4V3z"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  game: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="16" cy="11" r="1" class="fill"/><circle cx="18" cy="14" r="1" class="fill"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="4"/><path d="M12 4v4M9 13h.01M15 13h.01M9.5 17h5"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
};

const BOOK_HTML = `
  <div class="book">
    <div class="page page-left">
      <span class="ln" style="--w:92%"></span><span class="ln" style="--w:80%"></span>
      <span class="ln" style="--w:88%"></span><span class="ln" style="--w:64%"></span>
      <span class="ln" style="--w:90%"></span><span class="ln" style="--w:72%"></span>
      <span class="ln" style="--w:84%"></span>
    </div>
    <div class="page page-right">
      <p class="book-text">She found the old book by pure <mark class="word">serendipity<span class="tip">a happy accident</span></mark> one rainy evening…</p>
      <span class="ln" style="--w:86%"></span><span class="ln" style="--w:70%"></span><span class="ln" style="--w:90%"></span>
    </div>
  </div>
  <div class="flash f1"><div class="flash-inner"><b>journey</b><b class="back">a long trip</b></div></div>
  <div class="flash f2"><div class="flash-inner"><b>bright</b><b class="back">full of light</b></div></div>`;

const POPUP_HTML = `
  <div class="pm-title">NotebookLM Duplicates</div>
  <div class="pm-btn">Find duplicates</div>
  <div class="pm-status">Open a notebook and press the button.</div>
  <div class="pm-list">
    <div>youtube.com/watch?v=dQw… — remove: 2</div>
    <div>Lecture 3. Neural networks — remove: 1</div>
    <div>medium.com/@ai/attention… — remove: 1</div>
  </div>
  <div class="pm-btn pm-danger">Remove found duplicates</div>`;

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const escapeText = text => String(text).replace(/[&<>"]/g, ch => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[ch]);
const withCode = text => escapeText(text).replace(/`([^`]+)`/g, "<code>$1</code>");
const fileName = path => (path || "").split("/").pop();
const themeOf = project => THEMES[project.color] || THEMES.cyan;
// The editor previews files that aren't saved yet, so it can swap paths for temporary links.
const assetUrl = path => (typeof window.RESOLVE_ASSET === "function" && window.RESOLVE_ASSET(path)) || path;

function chips(tags) {
  const list = make("ul", "chips");
  for (const tag of tags) list.append(make("li", "", tag));
  return list;
}

function picture(className, path) {
  const box = make("div", className);
  const img = make("img");
  img.src = assetUrl(path);
  img.alt = "";
  img.loading = "lazy";
  box.append(img);
  return box;
}

/* ---------- terminal preview ---------- */
function outputClass(line) {
  if (/^https?:\/\//.test(line)) return "c";
  if (/^(…|\.\.\.)/.test(line)) return "dim";
  if (/^(===|✔|✓|done)/i.test(line)) return "ok";
  return "";
}

function terminalScript(terminal) {
  const lines = [];
  if (terminal.ask) lines.push({ask: terminal.ask, type: terminal.answer || ""});
  (terminal.output || []).forEach((out, i) => {
    lines.push({out, cls: outputClass(out), delay: i === 0 && terminal.ask ? 700 : 220});
  });
  return lines;
}

/* ---------- top picture of online cards ---------- */
function autoVisual(box, project) {
  box.classList.add("auto-visual");
  box.style.setProperty("--accent", `var(--${THEMES[project.color] ? project.color : "cyan"})`);
  box.append(make("span", "auto-ring"), make("span", "auto-ring r2"), make("span", "auto-ring r3"));
  for (let i = 1; i <= 3; i++) box.append(make("span", `auto-dot d${i}`));
  const orb = make("span", "auto-orb");
  orb.append(make("span", "auto-emoji", project.emoji || "✨"));
  box.append(orb, make("span", "auto-word", project.title || ""));
}

function onlineVisual(project) {
  const box = make("div", "card-visual");
  box.setAttribute("aria-hidden", "true");
  if (project.visual === "book") {
    box.classList.add("reader-visual");
    box.innerHTML = BOOK_HTML;
  } else if (project.visual === "maze") {
    box.classList.add("maze-visual");
    box.innerHTML = '<svg class="maze" viewBox="0 0 460 300" preserveAspectRatio="xMidYMid meet"></svg>';
  } else if (project.visual === "image" && project.image) {
    box.classList.add("image-visual");
    box.append(picture("image-frame", project.image));
  } else {
    autoVisual(box, project);
  }
  return box;
}

/* ---------- cards ---------- */
function onlineCard(project, reveal) {
  const theme = themeOf(project);
  const card = make("article", `card card-online${reveal ? " reveal" : ""}`);
  card.dataset.tilt = "";
  const body = make("div", "card-body");
  const top = make("div", "card-top");
  if (project.badge) top.append(make("span", `badge ${theme.badge}`, project.badge));
  if (project.status) {
    const live = make("span", "live");
    live.append(make("span", "pulse"), project.status);
    top.append(live);
  }
  body.append(top, make("h3", "", project.title || "Untitled"));
  if (project.description) body.append(make("p", "", project.description));
  if (project.tags?.length) body.append(chips(project.tags));
  if (project.button?.link) {
    const button = make("a", `btn btn-primary ${theme.button}`);
    button.href = project.button.link;
    button.target = "_blank";
    button.rel = "noopener";
    button.append(make("span", "", project.button.text || "Open ↗"));
    body.append(button);
  }
  card.append(onlineVisual(project), body);
  return card;
}

function downloadPreview(project) {
  const terminal = project.terminal;
  if (project.visual === "terminal" && terminal && (terminal.ask || terminal.output?.length)) {
    const box = make("div", "terminal mini");
    const bar = make("div", "term-bar");
    bar.innerHTML = "<i></i><i></i><i></i>";
    bar.append(make("span", "", terminal.title || fileName(project.download?.file) || project.title));
    const pre = make("pre", "term-body");
    pre.dataset.script = project.id;
    pre.terminalLines = terminalScript(terminal);
    box.append(bar, pre);
    return box;
  }
  if (project.visual === "notebooklm") {
    const box = make("div", "popup-mock");
    box.dataset.popup = "";
    box.innerHTML = POPUP_HTML;
    return box;
  }
  if (project.visual === "image" && project.image) return picture("dl-shot", project.image);
  return null;
}

function downloadCard(project, reveal) {
  const theme = themeOf(project);
  const card = make("article", `card dl-card${reveal ? " reveal" : ""}`);
  card.dataset.tilt = "";

  const head = make("div", "dl-head");
  const icon = make("div", `dl-icon ${theme.icon}`);
  if (ICONS[project.icon]) icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[project.icon]}</svg>`;
  else icon.append(make("span", "dl-emoji", project.icon || "✨"));
  const names = make("div");
  if (project.badge) names.append(make("span", `badge ${theme.badge}`, project.badge));
  names.append(make("h3", "", project.title || "Untitled"));
  head.append(icon, names);
  card.append(head);

  if (project.description) card.append(make("p", "", project.description));
  const preview = downloadPreview(project);
  if (preview) card.append(preview);
  if (project.tags?.length) card.append(chips(project.tags));

  const actions = make("div", "dl-actions");
  if (project.download?.file) {
    const button = make("a", `btn btn-primary ${theme.button}`);
    button.href = assetUrl(project.download.file);
    button.setAttribute("download", "");
    button.append(make("span", "", project.download.label || `Download .${fileName(project.download.file).split(".").pop()}`));
    if (project.download.size) button.append(make("small", "", project.download.size));
    actions.append(button);
  }
  if (project.code?.file) {
    const source = make("a", "btn btn-ghost", `Source .${fileName(project.code.file).split(".").pop()}`);
    source.href = `code.html?file=${encodeURIComponent(project.id)}`;
    actions.append(source);
  }
  if (actions.children.length) card.append(actions);

  if (project.code?.install) {
    const hint = make("p", "hint", "To run from source: ");
    hint.append(make("code", "", project.code.install));
    card.append(hint);
  }
  if (project.install?.length) {
    const details = make("details", "install");
    const steps = make("ol");
    for (const step of project.install) {
      const item = make("li");
      item.innerHTML = withCode(step);
      steps.append(item);
    }
    details.append(make("summary", "", "How to install"), steps);
    card.append(details);
  }
  return card;
}

function renderCard(project, {reveal = true} = {}) {
  return project.section === "online" ? onlineCard(project, reveal) : downloadCard(project, reveal);
}

/* ---------- whole page ---------- */
function renderProjects() {
  const onlineGrid = document.getElementById("onlineGrid");
  const downloadGrid = document.getElementById("downloadGrid");
  if (!onlineGrid && !downloadGrid) return;

  const projects = window.PROJECTS || [];
  const online = projects.filter(p => p.section === "online");
  const downloads = projects.filter(p => p.section !== "online");
  onlineGrid.replaceChildren(...online.map(p => renderCard(p)));
  downloadGrid.replaceChildren(...downloads.map(p => renderCard(p)));
  document.getElementById("online").hidden = !online.length;
  document.getElementById("download").hidden = !downloads.length;

  const setText = (id, text) => {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  };
  const plural = (n, one, many) => (n === 1 ? one : many);
  setText("projectCount", `${projects.length} ${plural(projects.length, "project", "projects")}`);
  document.getElementById("statOnline")?.setAttribute("data-count", online.length);
  document.getElementById("statDownload")?.setAttribute("data-count", downloads.length);
  setText("statOnlineLabel", plural(online.length, "project", "projects"));
  setText("statDownloadLabel", plural(downloads.length, "tool", "tools"));

  const footerLinks = document.getElementById("footerLinks");
  if (footerLinks) {
    for (const project of online.filter(p => p.button?.link).reverse()) {
      const link = make("a", "", project.title);
      link.href = project.button.link;
      link.target = "_blank";
      link.rel = "noopener";
      footerLinks.prepend(link);
    }
  }
}

renderProjects();
