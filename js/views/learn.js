// The course map.
import { h } from '../util.js';
import { state } from '../state.js';
import { ACTIVE_UNITS, PLANNED_UNITS, lessonStatus, testStatus, unitUnlocked, unitProgress } from '../content.js';
import { openLesson, openTest } from './lesson.js';
import { gateCard } from './review.js';

function node({ icon, label, sub, status, test = false, perfect = false, onclick }) {
  const n = h('button', { class: `node ${status}${test ? ' test' : ''}`, type: 'button', disabled: status === 'locked', onclick: status === 'gated' ? () => window.scrollTo({ top: 0, behavior: 'smooth' }) : onclick },
    h('div', { class: 'circle' }, status === 'locked' ? '🔒' : status === 'gated' ? '🔁' : status === 'done' && !test ? '✓' : icon),
    h('div', { class: 'label' }, label),
    sub ? h('div', { class: 'sub' }, sub) : null);
  if (perfect) n.append(h('div', { class: 'crown' }, '👑'));
  return n;
}

export function render() {
  const el = h('div');
  el.append(h('h1', {}, 'Your course'), h('p', {}, 'Phase 1 takes you to TORFL Elementary (A1). Pass every lesson (80%) to unlock the unit test; pass the test to unlock the next unit.'));
  const gc = gateCard(); if (gc) el.append(gc);
  for (const u of ACTIVE_UNITS) {
    const unlocked = unitUnlocked(u);
    const prog = unitProgress(u);
    const sec = h('section', { class: 'unit' });
    sec.append(h('div', { class: `unit-head${unlocked ? '' : ' locked'}` },
      h('div', {}, h('div', { class: 'u-num' }, `Unit ${u.num} · ${u.ru}`), h('h2', {}, `${u.icon} ${u.title}`), h('p', { class: 'small', style: { margin: 0 } }, u.desc)),
      h('div', { class: 'center' }, h('div', { class: `pill ${prog.pct === 100 ? 'green' : 'accent'}` }, `${prog.done}/${prog.total}`))));
    const path = h('div', { class: 'path' });
    u.lessons.forEach((l, i) => {
      const status = lessonStatus(u, i);
      const rec = state.lessons[l.id];
      const sub = status === 'gated' ? 'Review first' : rec?.completed ? (rec.passed ? `Best ${rec.best}%` : `Best ${rec.best}% · need 80%`) : `Lesson ${i + 1}`;
      path.append(node({ icon: l.icon, label: l.title, sub, status, perfect: rec?.best === 100, onclick: () => openLesson(l.id) }));
    });
    const ts = testStatus(u);
    const trec = state.tests[u.test.id];
    path.append(node({ icon: '🏆', label: u.test.title, sub: trec?.passed ? `Passed · best ${trec.best}%` : trec?.attempts ? `Best ${trec.best}% · need ${u.test.passMark}%` : `Pass mark ${u.test.passMark}%`, status: ts, test: true, onclick: () => openTest(u.id) }));
    sec.append(path);
    el.append(sec);
  }
  el.append(h('div', { class: 'card soft' }, h('h3', {}, 'Coming next'),
    h('p', { class: 'small' }, 'These units are planned for Phase 1. They unlock as they are built.'),
    h('div', { class: 'coming' }, PLANNED_UNITS.map(u => h('div', { class: 'item' }, h('div', { class: 'ico' }, u.icon), h('div', { class: 'body' }, h('b', {}, `Unit ${u.num} · ${u.title}`), h('span', {}, u.desc)))))));
  return el;
}
