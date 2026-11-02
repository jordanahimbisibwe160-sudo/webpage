"use strict";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
/* ---------- Preloader ---------- */
(function preloader() {
 const loader = $("#preloader");
 const bar = $("#preloaderBar");
  let progress = 0;
 const timer = setInterval(() => {
 progress = Math.min(progress + Math.random() * 25, 100);
 bar.style.width = progress + "%";
 if (progress >= 100) {
 clearInterval(timer);
 setTimeout(() => {
     loader.classList.add("done");
 document.body.classList.add("loaded");
}, 300);
 }
 }, 150);
})();
/* ---------- Theme toggle (black default, white optional) ---------- */
(function theme() {
const root = document.documentElement;
 const saved = localStorage.getItem("jg-theme");
 if (saved) root.setAttribute("data-theme", saved);
 $("#themeToggle").addEventListener("click", () => {
 const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
 root.setAttribute("data-theme", next);
 localStorage.setItem("jg-theme", next);
 });
})();
/* ---------- Header: scroll state, hide on scroll down, progress bar ---------- */
(function header() {
     const h = $("#header");
 const prog = $("#progress");
 let last = 0;
 window.addEventListener("scroll", () => {
 const y = window.scrollY;
h.classList.toggle("scrolled", y > 50);
 h.classList.toggle("hide", y > last && y > 400 &&
!$("#nav").classList.contains("open"));
 last = y;
const max = document.documentElement.scrollHeight - innerHeight;
prog.style.width = (y / max) * 100 + "%";
 $("#toTop").style.visibility = y > 600 ? "visible" : "hidden";
 }, { passive: true });
})();
/* ---------- Mobile menu ---------- */
(function menu() {
 const burger = $("#burger");
 const nav = $("#nav");
 const toggle = () => {
     burger.classList.toggle("open");
 nav.classList.toggle("open");
document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
 };
 burger.addEventListener("click", toggle);
 $$(".nav__link").forEach((l) =>
 l.addEventListener("click", () => nav.classList.contains("open") && toggle())
 );
})();
/* ---------- Active nav link on scroll ---------- */
(function activeLink() {
 const links = $$(".nav__link");
 const sections = links.map((l) => $(l.getAttribute("href")));
 const io = new IntersectionObserver((entries) => {
 entries.forEach((e) => {
 if (e.isIntersecting) {
 links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") ===
"#" + e.target.id));
 }
 });
}, { threshold: 0.5 });
sections.forEach((s) => s && io.observe(s));
})();
/* ---------- Scroll reveal ---------- */
(function reveal() {
 const io = new IntersectionObserver((entries) => {
entries.forEach((e, i) => {
 if (e.isIntersecting) {
 setTimeout(() => e.target.classList.add("visible"), (i % 4) * 90);
 io.unobserve(e.target);
 }
 });
 }, { threshold: 0.15 });
 $$(".reveal").forEach((el) => io.observe(el));
})();
/* ---------- Counters ---------- */
(function counters() { const io = new IntersectionObserver((entries) => {
entries.forEach((e) => {
 if (!e.isIntersecting) return;
 const el = e.target;
 const target = +el.dataset.count;
 const start = performance.now();
 const dur = 1800;
 const tick = (now) => {
 const t = Math.min((now - start) / dur, 1);
 el.textContent = Math.floor(target * (1 - Math.pow(1 - t, 3)));
 if (t < 1) requestAnimationFrame(tick);
 };
 requestAnimationFrame(tick);
 io.unobserve(el);
 });
 }, { threshold: 0.6 });
 $$("[data-count]").forEach((el) => io.observe(el));
})();
/* ---------- Portfolio filter ---------- */
(function filter() {
 const buttons = $$(".filter");
 const items = $$(".work");
 buttons.forEach((btn) =>
     btn.addEventListener("click", () => {
 buttons.forEach((b) => b.classList.remove("active"));
 btn.classList.add("active");
 const f = btn.dataset.filter;
 items.forEach((it) => it.classList.toggle("hidden", f !== "all" &&
it.dataset.cat !== f));
 })
 );
})();
/* ---------- Custom cursor ---------- */
(function cursor() {
 if (matchMedia("(hover: none)").matches) return;
 const ring = $("#cursor");
 const dot = $("#cursorDot");
 let mx = 0, my = 0, rx = 0, ry = 0;
 window.addEventListener("mousemove", (e) => {
 mx = e.clientX; my = e.clientY;
 dot.style.left = mx + "px"; dot.style.top = my + "px";
 });
 (function loop() {
 rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
 ring.style.left = rx + "px"; ring.style.top = ry + "px";
 requestAnimationFrame(loop);
})();
 $$("a, button, .card, .work, input, textarea").forEach((el) => {
 el.addEventListener("mouseenter", () => ring.classList.add("hover"));
 el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
 });
})();
/* ---------- Magnetic buttons ---------- */
$$(".magnetic").forEach((btn) => {
 btn.addEventListener("mousemove", (e) => {
const r = btn.getBoundingClientRect();
const x = e.clientX - r.left - r.width / 2;
 const y = e.clientY - r.top - r.height / 2;
btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
});
 btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
});
/* ---------- 3D tilt cards ---------- */
$$(".tilt").forEach((card) => {
 card.addEventListener("mousemove", (e) => {
 const r = card.getBoundingClientRect();
const px = (e.clientX - r.left) / r.width - 0.5;
const py = (e.clientY - r.top) / r.height - 0.5;
 card.style.transform = `perspective(800px) rotateX(${-py * 8}deg) rotateY(${px *
8}deg) translateY(-6px)`;
 });
 card.addEventListener("mouseleave", () => (card.style.transform = ""));
});
/* ---------- Hero background: interactive particle network ---------- */
(function particles() {
 const canvas = $("#bgCanvas");
 const ctx = canvas.getContext("2d");
 let w, h, pts = [];
 const mouse = { x: null, y: null };
 const resize = () => {
 w = canvas.width = canvas.offsetWidth;
 h = canvas.height = canvas.offsetHeight;
 const count = Math.min(90, Math.floor((w * h) / 16000));
 pts = Array.from({ length: count }, () => ({
 x: Math.random() * w, y: Math.random() * h,
 vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
 }));

 };
resize();
 window.addEventListener("resize", resize);
 canvas.parentElement.addEventListener("mousemove", (e) => {
 const r = canvas.getBoundingClientRect();
 mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;

 });

  canvas.parentElement.addEventListener("mouseleave", () => (mouse.x = mouse.y =
null));
 const draw = () => {
 ctx.clearRect(0, 0, w, h);
 const light = document.documentElement.getAttribute("data-theme") === "light";
 const c = light ? "0,0,0" : "255,255,255";
 pts.forEach((p, i) => {
 p.x += p.vx; p.y += p.vy;
 if (p.x < 0 || p.x > w) p.vx *= -1;
 if (p.y < 0 || p.y > h) p.vy *= -1;
 ctx.beginPath();
 ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
 ctx.fillStyle = `rgba(${c},0.8)`;
    ctx.fill();
 for (let j = i + 1; j < pts.length; j++) {
 const q = pts[j];
 const d = Math.hypot(p.x - q.x, p.y - q.y);
 if (d < 120) {
 ctx.strokeStyle = `rgba(${c},${0.18 * (1 - d / 120)})`;
 ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
 }}
 if (mouse.x !== null) {
 const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
 if (d < 160) {
 ctx.strokeStyle = `rgba(${c},${0.4 * (1 - d / 160)})`;
 ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
ctx.stroke();
 p.x += (mouse.x - p.x) * 0.002; p.y += (mouse.y - p.y) * 0.002;
 }
 }
 });
 requestAnimationFrame(draw);
 };
draw();
})();
/* ---------- Contact form validation ---------- */
(function form() {
 const f = $("#contactForm");
 const status = $("#formStatus");
 const rules = {
 name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
 email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email."),
 message: (v) => (v.trim().length >= 10 ? "" : "Tell us a bit more (10+ characters)."),
 };
 const check = (id) => {
 const input = $("#" + id);
 const msg = rules[id](input.value);
 input.parentElement.classList.toggle("invalid", !!msg);
 $(".error", input.parentElement).textContent = msg;
 return !msg;
 };
 Object.keys(rules).forEach((id) => $("#" + id).addEventListener("blur", () =>
check(id)));
 f.addEventListener("submit", (e) => {
 e.preventDefault();
 const ok = Object.keys(rules).map(check).every(Boolean);
 if (!ok) { status.textContent = ""; return; }
     status.textContent = "Sending...";
    fetch("https://formspree.io/f/xkjjpklv", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        name: $("#name").value,
        email: $("#email").value,
        message: $("#message").value
      })
    })
      .then((r) => {
        if (r.ok) {
          status.textContent = "✓ Thanks! Your message has been sent.";
          f.reset();
        } else {
          status.textContent = "Something went wrong. Please try again.";
        }
      })
      .catch(() => {
        status.textContent = "Network error. Check your internet and try again.";
      });
 });
})();
/* ---------- Back to top + footer year ---------- */
$("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior:
"smooth" }));
$("#year").textContent = new Date().getFullYear();