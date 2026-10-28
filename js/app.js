// App bootstrap: hash router, top bar, nav badges, theme, swipe navigation, service worker.
import { $, $$, navigate } from './util.js';
import { state, onChange, currentStreak, detectBreak } from './state.js';
import { dueCount } from './srs.js';
import { pendingHomework, GATE } from './content.js';
import { checkBadges } from './gamify.js';
import { applyTheme as applyAccent } from './shop.js';
import * as home from './views/home.js';
import * as learn from './views/learn.js';
import * as review from './views/review.js';
import * as alphabet from './views/alphabet.js';
import * as homework from './views/homework.js';
import * as profile from './views/profile.js';
import * as settings from './views/settings.js';
import * as shop from './views/shop.js';
import { openLesson, openTest } from './views/lesson.js';

const routes = { home, learn, review, alphabet, homework, profile, settings, shop };
// Tab order for swiping; secondary pages map onto their parent tab.
const TABS = ['home', 'learn', 'review', 'homework', 'profile'];
const PARENT = { alphabet: 'learn', settings: 'profile', shop: 'profile' };
let currentRoute = 'home';

function applyTheme() {
  document.documentElement.dataset.theme = state.settings.theme || 'dark';
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.content = state.settings.theme === 'light' ? '#f3f4fb' : '#0f1220';
  applyAccent();
}

function updateTop() {
  $('#top-streak').textContent = currentStreak();
  $('#top-xp').textContent = state.xp;
  $('#top-coins').textContent = state.coins;
  const due = dueCount(), hw = pendingHomework().length;
  const dueEl = $('#nav-due'), hwEl = $('#nav-hw');
  dueEl.hidden = !due; dueEl.textContent = due > 99 ? '99+' : due;
  hwEl.hidden = !hw; hwEl.textContent = hw;
}

function route() {
  const hash = location.hash || '#/home';
  const [, name = 'home', arg] = hash.split('/');
  if (name === 'lesson' && arg) { renderView('learn'); openLesson(arg); return; }
  if (name === 'test' && arg) { renderView('learn'); openTest(arg); return; }
  renderView(routes[name] ? name : 'home');
}
function renderView(name, dir = 0) {
  const view = routes[name];
  const el = $('#view');
  try { el.replaceChildren(view.render()); }
  catch (err) { console.error(err); el.innerHTML = `<div class="card"><h2>Something went wrong</h2><p>${err.message}</p></div>`; }
  if (dir) { el.classList.remove('slide-left', 'slide-right'); void el.offsetWidth; el.classList.add(dir < 0 ? 'slide-left' : 'slide-right'); }
  currentRoute = name;
  const tab = PARENT[name] || name;
  $$('#nav a').forEach(a => a.classList.toggle('active', a.dataset.route === tab));
  window.scrollTo(0, 0);
  updateTop();
}

/* ── Swipe between tabs (touch only; ignores vertical scrolls and text fields) ── */
let swipeDir = 0;
function setupSwipe() {
  const el = $('#view');
  let sx = 0, sy = 0, t0 = 0, ok = false;
  el.addEventListener('touchstart', e => {
    const t = e.touches[0]; sx = t.clientX; sy = t.clientY; t0 = Date.now();
    ok = !e.target.closest('input, textarea, select, .kbd, .chart, [data-noswipe]');
  }, { passive: true });
  el.addEventListener('touchend', e => {
    if (!ok) return;
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Date.now() - t0 > 700 || Math.abs(dx) < 70 || Math.abs(dy) > 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const tab = PARENT[currentRoute] || currentRoute;
    const i = TABS.indexOf(tab);
    const next = TABS[i + (dx < 0 ? 1 : -1)];
    if (!next) return;
    swipeDir = dx < 0 ? -1 : 1;
    navigate('#/' + next);
  }, { passive: true });
}
window.addEventListener('hashchange', () => { const d = swipeDir; swipeDir = 0; routeWithDir(d); });
function routeWithDir(d) {
  const hash = location.hash || '#/home';
  const [, name = 'home', arg] = hash.split('/');
  if ((name === 'lesson' || name === 'test') && arg) return route();
  renderView(routes[name] ? name : 'home', d);
}

applyTheme();
detectBreak(GATE.breakDays, GATE.minDeck);
checkBadges();
onChange(updateTop);
setupSwipe();
route();

if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
}
