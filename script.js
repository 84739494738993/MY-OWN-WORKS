document.documentElement.classList.add("js");

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* ---------- hero: typed words ---------- */
const WORDS = ["games", "web apps", "tools", "extensions"];

async function typeWords(target) {
  let index = 0;
  while (true) {
    await sleep(1900);
    while (target.textContent.length) {
      target.textContent = target.textContent.slice(0, -1);
      await sleep(45);
    }
    index = (index + 1) % WORDS.length;
    await sleep(260);
    for (const ch of WORDS[index]) {
      target.textContent += ch;
      await sleep(70 + Math.random() * 70);
    }
  }
}

/* ---------- terminals ---------- */
const TERMINALS = {
  hero: [
    {cmd: "whoami"},
    {out: "fenix", cls: "v"},
    {cmd: "ls ~/projects"},
    {out: "read-and-enjoy/     wild-labyrinth/\nyoutube-links/      tab-links/\nnotebooklm-deduper/", cls: "c"},
    {cmd: "cat about.txt"},
    {out: "I build games, web apps and tools\nthat save you time. Everything is free :)"},
    {cmd: "./welcome --style=neon"},
    {out: "✔ Welcome! Scroll down ↓", cls: "ok"},
  ],
  youtube: [
    {ask: "Paste a YouTube channel link: ", type: "https://youtube.com/@Google"},
    {out: "https://www.youtube.com/watch?v=DDjr6gXqtN8", cls: "c", delay: 700},
    {out: "https://www.youtube.com/watch?v=lL7L6DiGeLc", cls: "c"},
    {out: "https://www.youtube.com/watch?v=WMjVP7QQyDI", cls: "c"},
    {out: "… and 2027 more links", cls: "dim", delay: 400},
    {out: "Press Enter to exit..."},
  ],
  tabs: [
    {ask: "How many tabs are open in the browser? ", type: "3"},
    {out: "Script started! Quickly switch to the browser window...", delay: 900},
    {out: "https://read-and-enjoy.onrender.com/", cls: "c", delay: 500},
    {out: "https://starter-programist.itch.io/wild-labrynth", cls: "c", delay: 500},
    {out: "https://notebooklm.google.com/", cls: "c", delay: 500},
    {out: "=== DONE ===", cls: "ok"},
  ],
};

async function runTerminal(pre) {
  const lines = TERMINALS[pre.dataset.script];
  const instant = reduceMotion;
  const caret = el("span", "term-caret");
  pre.textContent = "";

  for (const line of lines) {
    const row = el("span", `t-row ${line.cls || ""}`);
    pre.append(row);
    if (line.out === undefined) {
      const typed = el("span", "ty");
      row.append(line.cmd !== undefined ? el("span", "pr", "❯ ") : el("span", "q", line.ask), typed, caret);
      const text = line.cmd ?? line.type;
      if (instant) {
        typed.textContent = text;
      } else {
        await sleep(380);
        for (const ch of text) {
          typed.textContent += ch;
          await sleep(35 + Math.random() * 75);
        }
        await sleep(280);
      }
    } else {
      row.textContent = line.out;
      if (!instant) await sleep(line.delay ?? 140);
    }
  }

  if (lines[0].cmd !== undefined) {
    const prompt = el("span", "t-row");
    prompt.append(el("span", "pr", "❯ "), caret);
    pre.append(prompt);
  } else {
    pre.lastChild.append(caret);
  }

  if (pre.hasAttribute("data-loop") && !instant) {
    await sleep(6000);
    runTerminal(pre);
  }
}

/* ---------- extension popup ---------- */
async function runPopup(root) {
  const button = root.querySelector(".pm-btn");
  const status = root.querySelector(".pm-status");
  const rows = root.querySelectorAll(".pm-list div");
  const danger = root.querySelector(".pm-danger");
  const result = "Sources: 48. Duplicates: 4.";

  if (reduceMotion) {
    status.textContent = result;
    rows.forEach(row => row.classList.add("show"));
    danger.classList.add("show");
    return;
  }

  await sleep(800);
  button.classList.add("clicked");
  await sleep(180);
  button.classList.remove("clicked");
  status.textContent = "Scanning sources…";
  await sleep(1300);
  status.textContent = "";
  for (const ch of result) {
    status.textContent += ch;
    await sleep(30);
  }
  for (const row of rows) {
    await sleep(260);
    row.classList.add("show");
  }
  await sleep(300);
  danger.classList.add("show");
}

/* ---------- heading decode effect ---------- */
const GLYPHS = "▓▒░<>/\\[]{}=+*#%ABCDEFGHJKLMNPQRSTUVWXYZ01";

function scramble(heading) {
  const final = heading.textContent;
  if (reduceMotion) return;
  heading.setAttribute("aria-label", final);
  heading.style.minHeight = `${heading.offsetHeight}px`;
  const plan = [...final].map((ch, i) => ({ch, end: 6 + Math.floor(i * 1.1 + Math.random() * 12)}));
  let frame = 0;

  const tick = () => {
    let done = 0;
    heading.textContent = plan.map(({ch, end}) => {
      if (frame >= end || ch === " ") {
        done++;
        return ch;
      }
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }).join("");
    frame++;
    if (done < plan.length) {
      setTimeout(() => requestAnimationFrame(tick), 28);
    } else {
      heading.style.minHeight = "";
    }
  };
  tick();
}

/* ---------- counters ---------- */
function countUp(node) {
  const target = Number(node.dataset.count);
  const suffix = node.dataset.suffix || "";
  if (reduceMotion) {
    node.textContent = target + suffix;
    return;
  }
  const start = performance.now();
  const step = now => {
    const k = Math.min(1, (now - start) / 1500);
    node.textContent = Math.round(target * (1 - (1 - k) ** 3)) + suffix;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- living maze ---------- */
const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl(tag, attrs) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
}

function generateMaze(cols, rows) {
  // walls[cell] = [top, right, bottom, left]
  const walls = Array.from({length: cols * rows}, () => [1, 1, 1, 1]);
  const seen = new Array(cols * rows).fill(false);
  const stack = [0];
  seen[0] = true;
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const x = cur % cols;
    const y = Math.floor(cur / cols);
    const options = [];
    if (y > 0 && !seen[cur - cols]) options.push([cur - cols, 0, 2]);
    if (x < cols - 1 && !seen[cur + 1]) options.push([cur + 1, 1, 3]);
    if (y < rows - 1 && !seen[cur + cols]) options.push([cur + cols, 2, 0]);
    if (x > 0 && !seen[cur - 1]) options.push([cur - 1, 3, 1]);
    if (!options.length) {
      stack.pop();
      continue;
    }
    const [next, wall, opposite] = options[Math.floor(Math.random() * options.length)];
    walls[cur][wall] = 0;
    walls[next][opposite] = 0;
    seen[next] = true;
    stack.push(next);
  }
  return walls;
}

function solveMaze(walls, cols, from, to) {
  const prev = new Map([[from, -1]]);
  const queue = [from];
  const steps = [[-cols, 0], [1, 1], [cols, 2], [-1, 3]];
  while (queue.length) {
    const cur = queue.shift();
    if (cur === to) break;
    for (const [delta, wall] of steps) {
      const next = cur + delta;
      if (!walls[cur][wall] && !prev.has(next)) {
        prev.set(next, cur);
        queue.push(next);
      }
    }
  }
  const path = [];
  for (let cur = to; cur !== -1; cur = prev.get(cur)) path.unshift(cur);
  return path;
}

function initMaze(svg) {
  const COLS = 11, ROWS = 7, SIZE = 40, PAD = 10;
  const center = (cell, axis) => PAD + SIZE / 2 + SIZE * (axis === "x" ? cell % COLS : Math.floor(cell / COLS));
  let visible = false;
  let running = false;

  svg.innerHTML = `<defs><linearGradient id="mazeGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="460" y2="300">
    <stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#8b5cf6"/><stop offset="1" stop-color="#f472b6"/></linearGradient></defs>`;

  async function cycle() {
    running = true;
    const walls = generateMaze(COLS, ROWS);
    const group = svgEl("g", {class: "walls-group"});
    const wallLayer = svgEl("g", {class: "walls"});
    const segments = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const w = walls[y * COLS + x];
        const X = PAD + x * SIZE, Y = PAD + y * SIZE;
        if (w[0]) segments.push([X, Y, X + SIZE, Y]);
        if (w[3]) segments.push([X, Y, X, Y + SIZE]);
        if (x === COLS - 1 && w[1]) segments.push([X + SIZE, Y, X + SIZE, Y + SIZE]);
        if (y === ROWS - 1 && w[2]) segments.push([X, Y + SIZE, X + SIZE, Y + SIZE]);
      }
    }
    for (const [x1, y1, x2, y2] of segments) {
      const line = svgEl("line", {x1, y1, x2, y2, pathLength: 1});
      line.style.transitionDelay = `${((x1 + y1) / 760) * 1.4}s`;
      wallLayer.append(line);
    }
    group.append(wallLayer);

    const corners = [[0, "#22d3ee"], [COLS - 1, "#f472b6"], [COLS * (ROWS - 1), "#a3e635"], [COLS * ROWS - 1, "#fbbf24"]];
    for (const [cell, color] of corners) {
      const cx = center(cell, "x"), cy = center(cell, "y");
      group.append(svgEl("polygon", {class: "gem", fill: color, points: `${cx},${cy - 8} ${cx + 8},${cy} ${cx},${cy + 8} ${cx - 8},${cy}`}));
    }
    const goal = Math.floor(ROWS / 2) * COLS + Math.floor(COLS / 2);
    const gx = center(goal, "x"), gy = center(goal, "y");
    group.append(svgEl("polygon", {class: "gem gold", fill: "#fde68a", points: `${gx},${gy - 12} ${gx + 12},${gy} ${gx},${gy + 12} ${gx - 12},${gy}`}));

    const route = solveMaze(walls, COLS, 0, goal);
    const trail = svgEl("path", {
      d: route.map((cell, i) => `${i ? "L" : "M"}${center(cell, "x")} ${center(cell, "y")}`).join(""),
      fill: "none", stroke: "rgba(255,255,255,.18)", "stroke-width": 3, "stroke-linecap": "round",
      "stroke-linejoin": "round", "stroke-dasharray": "0 1", pathLength: 1,
    });
    const runner = svgEl("circle", {class: "runner", r: 7, fill: "#fff", cx: center(0, "x"), cy: center(0, "y")});
    group.append(trail, runner);

    svg.querySelector(".walls-group")?.remove();
    svg.classList.remove("drawn", "fading");
    svg.append(group);
    await sleep(60);
    svg.classList.add("drawn");
    await sleep(2400);

    const length = trail.getTotalLength();
    const duration = Math.max(2200, route.length * 170);
    const start = performance.now();
    await new Promise(resolve => {
      const move = now => {
        const k = Math.min(1, (now - start) / duration);
        const point = trail.getPointAtLength(length * k);
        runner.setAttribute("cx", point.x);
        runner.setAttribute("cy", point.y);
        trail.setAttribute("stroke-dasharray", `${k} 1`);
        if (k < 1) requestAnimationFrame(move);
        else resolve();
      };
      requestAnimationFrame(move);
    });

    await sleep(1200);
    svg.classList.add("fading");
    await sleep(700);
    running = false;
    if (visible) cycle();
  }

  if (reduceMotion) {
    cycle();
    return;
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !running) cycle();
  }).observe(svg);
}

/* ---------- reveal on scroll ---------- */
function onReveal(node) {
  node.classList.add("in");
  node.querySelectorAll("[data-scramble]").forEach(scramble);
  node.querySelectorAll("[data-count]").forEach(countUp);
  node.querySelectorAll("pre[data-script]:not([data-loop])").forEach(runTerminal);
  node.querySelectorAll("[data-popup]").forEach(runPopup);
}

document.querySelectorAll(".online-grid, .dl-grid, .hero-copy, .code-side").forEach(group => {
  [...group.querySelectorAll(":scope > .reveal")].forEach((item, i) => item.style.setProperty("--d", `${i * 0.12}s`));
});

const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    revealObserver.unobserve(entry.target);
    onReveal(entry.target);
  }
}, {threshold: 0.15, rootMargin: "0px 0px -40px 0px"});
document.querySelectorAll(".reveal").forEach(node => revealObserver.observe(node));

/* ---------- cursor, card tilt, progress ---------- */
const spotlight = document.querySelector(".spotlight");
let pointerFrame = 0;
addEventListener("pointermove", e => {
  cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => {
    spotlight.style.setProperty("--x", `${e.clientX}px`);
    spotlight.style.setProperty("--y", `${e.clientY}px`);
  });
}, {passive: true});

document.querySelectorAll("[data-tilt]").forEach(card => {
  card.addEventListener("pointermove", e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    if (e.pointerType === "mouse" && !reduceMotion) {
      card.style.transform = `perspective(1100px) rotateX(${(0.5 - y) * 4}deg) rotateY(${(x - 0.5) * 5}deg) translateY(-4px)`;
    }
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const progress = document.querySelector(".progress");
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.setProperty("--p", max > 0 ? scrollY / max : 0);
};
addEventListener("scroll", updateProgress, {passive: true});
updateProgress();

/* ---------- start (each page has only some of these parts) ---------- */
const year = document.getElementById("year");
const typed = document.getElementById("typed");
const heroTerminal = document.querySelector(".hero-term pre");
const maze = document.querySelector(".maze");

if (year) year.textContent = new Date().getFullYear();
if (typed && !reduceMotion) typeWords(typed);
if (heroTerminal) setTimeout(() => runTerminal(heroTerminal), reduceMotion ? 0 : 700);
if (maze) initMaze(maze);
