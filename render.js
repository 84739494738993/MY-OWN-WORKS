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
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
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

/* ---------- "hacker made of code": a hooded figure drawn by Matrix rain ---------- */
// Outlines in a 400 x 420 box; the figure stands on the bottom edge.
const HOOD_PATH = "M18 420 C24 346 80 308 124 292 C98 250 90 192 98 146 C110 74 156 26 200 22 " +
  "C244 26 290 74 302 146 C310 192 302 250 276 292 C320 308 376 346 382 420 Z";
const FACE_PATH = "M200 116 C176 116 162 146 162 186 C162 224 180 250 200 256 C220 250 238 224 238 186 C238 146 224 116 200 116 Z";
const FOLD_PATH = "M124 292 C110 336 102 380 98 420 M276 292 C290 336 298 380 302 420 M124 292 C160 316 240 316 276 292";
const CELL = {bg: 0, body: 1, face: 2, gap: 3, rim: 4, fold: 5};

// Same palette as the Matrix demos: from almost invisible dark green to bright green, never white.
const MATRIX_SHADES = Array.from({length: 32}, (_, i) => {
  const b = (i + 1) / 32;
  const srgb = c => Math.round(255 * Math.min(1, c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055));
  return `rgb(${srgb(0.16 * b * b * 0.95)},${srgb((0.3 + 0.7 * b) * b * 0.95)},${srgb((0.07 + 0.29 * b) * b * 0.95)})`;
});

function hackerMask(cols, rows, size, width, height) {
  const probe = document.createElement("canvas").getContext("2d");
  const scale = Math.min((height * 0.97) / 420, (width * 0.9) / 400);
  probe.setTransform(scale, 0, 0, scale, (width - 400 * scale) / 2, height - 420 * scale);
  probe.lineWidth = 9;
  const hood = new Path2D(HOOD_PATH), face = new Path2D(FACE_PATH), fold = new Path2D(FOLD_PATH);
  const mask = new Uint8Array(cols * rows);
  const at = (c, r) => (c < 0 || r < 0 || c >= cols || r >= rows ? CELL.bg : mask[r * cols + c]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) * size, y = (r + 0.5) * size;
      if (probe.isPointInPath(face, x, y)) mask[r * cols + c] = CELL.face;
      else if (probe.isPointInPath(hood, x, y)) mask[r * cols + c] = probe.isPointInStroke(fold, x, y) ? CELL.fold : CELL.body;
    }
  }
  // a dark gap around the figure, and a bright rim on its edges and around the face
  const result = mask.slice();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const here = at(c, r);
      const near = [at(c - 1, r), at(c + 1, r), at(c, r - 1), at(c, r + 1)];
      if (here === CELL.bg && near.some(n => n === CELL.body || n === CELL.fold)) result[r * cols + c] = CELL.gap;
      if (here === CELL.body && near.some(n => n === CELL.bg || n === CELL.face)) result[r * cols + c] = CELL.rim;
    }
  }
  return result;
}

function startHacker(canvas) {
  const ctx = canvas.getContext("2d");
  const glow = document.createElement("canvas");
  const gctx = glow.getContext("2d");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0, height = 0, dpr = 1, size = 10, cols = 0, rows = 0;
  let mask, glyphs, drops, visible = false, last = 0;

  function setup() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = glow.width = Math.round(width * dpr);
    canvas.height = glow.height = Math.round(height * dpr);
    size = Math.max(9, Math.round(height / 32));
    cols = Math.ceil(width / size);
    rows = Math.ceil(height / size);
    mask = hackerMask(cols, rows, size, width, height);
    glyphs = Uint8Array.from({length: cols * rows}, () => (Math.random() < 0.5 ? 0 : 1));
    drops = Array.from({length: cols}, () => ({head: Math.random() * rows * 2 - rows, speed: 4 + Math.random() * 9, trail: 6 + Math.random() * 14}));
    draw(0);
  }

  function draw(dt) {
    if (!mask) return;
    for (const c of [ctx, gctx]) {
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.textAlign = "center";
      c.textBaseline = "middle";
    }
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    gctx.clearRect(0, 0, width, height);
    ctx.font = `${Math.round(size * 0.8)}px monospace`;
    gctx.font = `bold ${Math.round(size * 0.92)}px monospace`;
    for (let i = 0; i < glyphs.length * 0.015; i++) glyphs[Math.floor(Math.random() * glyphs.length)] ^= 1;

    for (let c = 0; c < cols; c++) {
      const drop = drops[c];
      drop.head += drop.speed * dt;
      if (drop.head - drop.trail > rows) Object.assign(drop, {head: -Math.random() * rows * 0.5, speed: 4 + Math.random() * 9});
      for (let r = 0; r < rows; r++) {
        const type = mask[r * cols + c];
        if (type === CELL.gap) continue;
        const d = drop.head - r;
        const rain = d >= 0 && d < drop.trail ? 1 - d / drop.trail : 0;
        const top = 1 - r / rows;
        let b;
        if (type === CELL.bg) b = 0.1 + rain * 0.45;
        else if (type === CELL.body) b = 0.42 + top * 0.2 + rain * 0.4;
        else if (type === CELL.rim) b = 0.8 + rain * 0.2;
        else if (type === CELL.fold) b = 0.14 + rain * 0.3;
        else b = rain * 0.1;
        if (b < 0.04) continue;
        const target = type === CELL.body || type === CELL.rim ? gctx : ctx;
        target.fillStyle = MATRIX_SHADES[Math.min(31, Math.floor(b * 32))];
        target.fillText(glyphs[r * cols + c] ? "1" : "0", (c + 0.5) * size, (r + 0.5) * size);
      }
    }

    // soft glow only around the figure, then the crisp figure on top
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    ctx.filter = `blur(${Math.round(size * 0.5 * dpr)}px)`;
    ctx.globalAlpha = 0.85;
    ctx.drawImage(glow, 0, 0);
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    ctx.drawImage(glow, 0, 0);
    ctx.globalCompositeOperation = "source-over";
  }

  function loop(now) {
    if (!visible || !canvas.isConnected) return;
    requestAnimationFrame(loop);
    if (now - last < 45) return;  // ~22 frames per second is plenty for rain
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    draw(dt);
  }

  new ResizeObserver(setup).observe(canvas);
  if (still) return;
  new IntersectionObserver(([entry]) => {
    const wasVisible = visible;
    visible = entry.isIntersecting;
    if (visible && !wasVisible) {
      last = 0;
      requestAnimationFrame(loop);
    }
  }).observe(canvas);
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
  } else if (project.visual === "hacker") {
    box.classList.add("hacker-visual");
    const canvas = make("canvas");
    box.append(canvas);
    startHacker(canvas);
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
