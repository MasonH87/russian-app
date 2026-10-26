// App bootstrap: hash router, top bar, nav badges, theme, service worker.
import { $, $$ } from './util.js';
import { state, onChange, currentStreak, detectBreak } from './state.js';
import { dueCount } from './srs.js';
import { pendingHomework, GATE } from './content.js';
import { checkBadges } from './gamify.js';
import * as home from './views/home.js';
import * as learn from './views/learn.js';
import * as review from './views/review.js';
import * as alphabet from './views/alphabet.js';
import * as homework from './views/homework.js';
import * as profile from './views/profile.js';
import * as settings from './views/settings.js';
import { openLesson, openTest } from './views/lesson.js';

const routes = { home, learn, review, alphabet, homework, profile, settings };

function applyTheme() {
  document.documentElement.dataset.theme = state.settings.theme || 'dark';
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.content = state.settings.theme === 'light' ? '#f3f4fb' : '#0f1220';
}

function updateTop() {
  $('#top-streak').textContent = currentStreak();
  $('#top-xp').textContent = state.xp;
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
function renderView(name) {
  const view = routes[name];
  try { $('#view').replaceChildren(view.render()); }
  catch (err) { console.error(err); $('#view').innerHTML = `<div class="card"><h2>Something went wrong</h2><p>${err.message}</p></div>`; }
  $$('#nav a').forEach(a => a.classList.toggle('active', a.dataset.route === name || (name === 'alphabet' && a.dataset.route === 'learn') || (name === 'settings' && a.dataset.route === 'profile')));
  window.scrollTo(0, 0);
  updateTop();
}

applyTheme();
detectBreak(GATE.breakDays, GATE.minDeck);
checkBadges();
onChange(updateTop);
window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
}
