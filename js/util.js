// Small DOM + text helpers shared across the app.
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Hyperscript-style element builder: h('div', {class:'x', onclick:fn}, child, ...) */
export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') for (const [p, val] of Object.entries(v)) { if (p.startsWith('--')) el.style.setProperty(p, val); else el.style[p] = val; }
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export const STRESS = '́';
/** Remove combining stress marks (used for display only). */
export const stripStress = s => (s || '').normalize('NFC').replace(/́/g, '');

/** Normalize an answer for lenient comparison. */
export function norm(s) {
  return stripStress(s).toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[.,!?;:«»"“”'’()\-—–\[\]]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

export function lev(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/** Compare user answer with expected (+alternates). Returns {correct, typo}. */
export function matchAnswer(user, expected, accept = []) {
  const u = norm(user);
  if (!u) return { correct: false, typo: false };
  const targets = [expected, ...(accept || [])].map(norm);
  if (targets.includes(u)) return { correct: true, typo: false };
  for (const t of targets) {
    const tol = t.length >= 10 ? 2 : t.length >= 5 ? 1 : 0;
    if (tol && lev(u, t) <= tol) return { correct: true, typo: true };
  }
  return { correct: false, typo: false };
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const sample = (arr, n) => shuffle(arr).slice(0, n);
export const uniq = arr => [...new Set(arr)];

export function todayKey(d = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function addDays(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  return todayKey(new Date(y, m - 1, d + n));
}
export function daysBetween(a, b) {
  const [y1, m1, d1] = a.split('-').map(Number), [y2, m2, d2] = b.split('-').map(Number);
  return Math.round((new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1)) / 86400000);
}
export const DAY = 86400000;

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function toast(msg, kind = '') {
  const box = $('#toasts');
  const t = h('div', { class: `toast ${kind}` }, msg);
  box.append(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 2400);
}

/** Go to a hash route, re-rendering even if it is already the current one. */
export function navigate(hash) {
  if (location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = hash;
}

export function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
export function plural(n, one, many) { return `${n} ${n === 1 ? one : many}`; }
