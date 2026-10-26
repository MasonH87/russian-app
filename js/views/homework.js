// Homework: real-world tasks assigned by lessons, done with your partner.
import { h, toast, navigate } from '../util.js';
import { state, save, addXP } from '../state.js';
import { homeworkList } from '../content.js';
import { XP, checkBadges } from '../gamify.js';

export function render() {
  const list = homeworkList();
  const todo = list.filter(x => !x.status.done), done = list.filter(x => x.status.done);
  const el = h('div');
  el.append(h('h1', {}, 'Homework · Домашнее задание'), h('p', {}, 'Each lesson assigns one task to do out loud with your girlfriend. Marking it done earns XP; her confirmation earns a bonus and counts toward the “Вместе” badge.'));
  if (!list.length) el.append(h('div', { class: 'card' }, h('h3', {}, 'No homework yet'), h('p', {}, 'Complete your first lesson and the homework appears here.'), h('a', { class: 'btn', href: '#/learn' }, 'Go to lessons')));
  if (todo.length) { el.append(h('h2', {}, `To do (${todo.length})`)); todo.forEach(hw => el.append(card(hw))); }
  if (done.length) { el.append(h('h2', { class: 'mt' }, `Done (${done.length})`)); done.forEach(hw => el.append(card(hw))); }
  return el;
}

function card(hw) {
  const st = state.homework[hw.id] || (state.homework[hw.id] = { done: false, confirmed: false, note: '' });
  const note = h('textarea', { class: 'text', rows: 2, placeholder: 'Notes: words you learned, her score, what to fix…' }, st.note || '');
  note.addEventListener('change', () => { st.note = note.value; save(); });
  const doneBtn = h('button', { class: `check${st.done ? ' on' : ''}`, type: 'button', onclick: () => {
    if (!st.done) { st.done = true; st.doneAt = Date.now(); addXP(XP.homework, 'homework'); toast(`+${XP.homework} XP · homework done`, 'gold'); }
    else { st.done = false; save(); }
    checkBadges(); navigate('#/homework');
  } }, st.done ? '✓ Done' : 'Mark done');
  const confBtn = h('button', { class: `check${st.confirmed ? ' on' : ''}`, type: 'button', title: 'Tick this once your partner has heard you do it', onclick: () => {
    st.confirmed = !st.confirmed;
    if (st.confirmed && !st.confirmedXP) { st.confirmedXP = true; addXP(XP.homeworkConfirmed, 'homework-confirmed'); toast(`+${XP.homeworkConfirmed} XP · partner confirmed`, 'gold'); }
    else save();
    checkBadges(); navigate('#/homework');
  } }, st.confirmed ? '💞 Partner confirmed' : '💞 Partner confirms');
  return h('div', { class: `hw${st.done ? ' done' : ''}` },
    h('div', { class: 'muted small' }, `${hw.unitTitle} · ${hw.lessonTitle}`),
    h('h3', {}, '📝 ', hw.title),
    h('div', { class: 'hw-text' }, hw.text),
    note,
    h('div', { class: 'actions mt' }, doneBtn, confBtn));
}
