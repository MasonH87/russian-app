// Profile: level, streak, activity, mastery, badges.
import { h, todayKey, addDays } from '../util.js';
import { state, currentStreak } from '../state.js';
import { masteryCounts } from '../srs.js';
import { levelInfo, BADGES, cefrEstimate } from '../gamify.js';
import { unitsPassed, ACTIVE_UNITS } from '../content.js';
import { coachSummary } from '../coach.js';
import { toast } from '../util.js';

function coachCard() {
  const box = h('textarea', { class: 'text', rows: 8, readonly: true, hidden: true, style: { fontFamily: 'ui-monospace, monospace', fontSize: '.8rem' } });
  return h('div', { class: 'card' }, h('h3', {}, '🧑‍🏫 Coach report'),
    h('p', { class: 'small' }, 'Copies a short plain-text summary of your progress, weak words and homework notes. Paste it into your chat with Claude to get a personalised coaching session.'),
    h('div', { class: 'row' },
      h('button', { class: 'btn', type: 'button', onclick: async () => {
        const txt = coachSummary(); box.value = txt; box.hidden = false;
        try { await navigator.clipboard.writeText(txt); toast('Report copied. Paste it into the chat.', 'green'); }
        catch { toast('Select the text below and copy it.'); }
      } }, '📋 Copy report for my coach')),
    box);
}

export function render() {
  const lvl = levelInfo();
  const words = masteryCounts(id => id.startsWith('w:')), letters = masteryCounts(id => id.startsWith('l:'));
  const cefr = cefrEstimate(unitsPassed());
  const el = h('div');
  el.append(h('div', { class: 'spread' }, h('h1', {}, state.settings.name ? `${state.settings.name}` : 'Your profile'), h('a', { class: 'btn secondary sm', href: '#/settings' }, '⚙️ Settings')));

  el.append(h('div', { class: 'card' }, h('div', { class: 'level-card' },
    h('div', { class: 'level-num' }, lvl.level),
    h('div', { style: { flex: 1 } }, h('h2', {}, lvl.title), h('div', { class: 'progress gold' }, h('i', { style: { width: lvl.pct + '%' } })),
      h('div', { class: 'small muted', style: { marginTop: '6px' } }, `${lvl.into} / ${lvl.need} XP to level ${lvl.level + 1} · ${state.xp} XP total`))),
    h('div', { class: 'quick-stats' },
      h('div', { class: 'qs' }, h('b', {}, `🔥 ${currentStreak()}`), h('span', {}, `streak · best ${state.streak.best}`)),
      h('div', { class: 'qs' }, h('b', {}, `🧊 ${state.streak.freezes}`), h('span', {}, 'streak freezes')),
      h('div', { class: 'qs' }, h('b', {}, cefr.label), h('span', {}, cefr.note)))));

  el.append(coachCard());
  el.append(h('div', { class: 'card' }, h('h3', {}, 'Last 14 days'), activityChart(), h('p', { class: 'small', style: { margin: '8px 0 0' } }, `Daily goal: ${state.dailyGoal} XP. Gold bars hit the goal.`)));

  el.append(h('div', { class: 'card' }, h('h3', {}, `Vocabulary · ${words.total} words`),
    h('div', { class: 'mastery' },
      h('div', {}, h('b', {}, words.new), h('span', {}, 'new')),
      h('div', { style: { color: 'var(--gold)' } }, h('b', {}, words.learning), h('span', {}, 'learning')),
      h('div', { style: { color: 'var(--blue)' } }, h('b', {}, words.known), h('span', {}, 'known')),
      h('div', { style: { color: 'var(--green)' } }, h('b', {}, words.mastered), h('span', {}, 'mastered'))),
    h('div', { class: 'divider' }),
    h('div', { class: 'spread' }, h('span', {}, `Letters: ${letters.total}/33 learned, ${letters.known + letters.mastered} solid`), h('a', { class: 'btn ghost sm', href: '#/alphabet' }, 'Alphabet ›')),
    h('div', { class: 'progress green' }, h('i', { style: { width: Math.round(letters.total / 33 * 100) + '%' } }))));

  const earned = BADGES.filter(b => state.badges[b.id]).length;
  el.append(h('div', { class: 'card' }, h('h3', {}, `Badges · ${earned}/${BADGES.length}`),
    h('div', { class: 'badges' }, BADGES.map(b => h('div', { class: `badge ${state.badges[b.id] ? 'earned' : 'locked'}`, title: b.desc }, h('div', { class: 'b-ico' }, b.ico), h('b', {}, b.name), h('span', {}, b.desc))))));

  el.append(h('div', { class: 'card soft' }, h('h3', {}, 'Road to TORFL'),
    h('p', { class: 'small' }, 'TORFL (ТРКИ) is Russia’s official certificate. Elementary (A1) needs about 780 words and the grammar covered in Units 0 to 6. Basic (A2) is Phase 2. Each unit test here is built to resemble the exam’s vocabulary-and-grammar section; the mock exam in Unit 7 adds reading, listening, writing and speaking parts.'),
    h('div', { class: 'progress' }, h('i', { style: { width: Math.round(unitsPassed() / 7 * 100) + '%' } })),
    h('div', { class: 'small muted', style: { marginTop: '6px' } }, `${unitsPassed()} of 7 Phase 1 units passed · ${ACTIVE_UNITS.length} available so far`)));
  return el;
}

function activityChart() {
  const today = todayKey();
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13));
  const vals = days.map(d => state.xpByDay[d] || 0);
  const max = Math.max(state.dailyGoal, ...vals);
  return h('div', { class: 'chart', role: 'img', 'aria-label': 'XP earned per day over the last 14 days' }, days.map((d, i) => {
    const v = vals[i];
    const label = new Date(d + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'narrow' });
    return h('div', { class: `bar${v >= state.dailyGoal ? ' goal' : ''}` }, h('div', { class: 'tip' }, `${d}: ${v} XP`), h('i', { style: { height: Math.max(2, Math.round(v / max * 100)) + '%' } }), h('span', {}, label));
  }));
}
