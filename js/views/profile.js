// Profile: level, streak, activity, mastery, badges.
import { h, todayKey, addDays } from '../util.js';
import { state, currentStreak } from '../state.js';
import { masteryCounts } from '../srs.js';
import { levelInfo, BADGES, cefrEstimate, tierInfo, TIERS } from '../gamify.js';
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
  const cefr = { label: tierInfo(unitsPassed(), words.total).cur.cefr, note: tierInfo(unitsPassed(), words.total).cur.use };
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

  el.append(standingCard(words));
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

  el.append(h('div', { class: 'card soft' }, h('h3', {}, 'Road to the real exam'),
    h('p', { class: 'small' }, 'TORFL (ТРКИ) is Russia’s state certificate, run by the Pushkin State Russian Language Institute and partner universities, with in-person centres in many countries and online proctored sittings. The Elementary level (A1) expects roughly 780 words and five parts: vocabulary and grammar, reading, listening, writing, and a speaking interview, about 2½ hours in total.'),
    h('p', { class: 'small' }, 'Honest status of this app: unit tests here mirror only the vocabulary-and-grammar part. Listening and speaking are partly covered by the audio and speaking exercises; writing and the oral interview are not yet. The Unit 7 mock exam will add all five parts.'),
    h('b', { class: 'small' }, 'Book TORFL Elementary when all of these are true:'),
    h('ul', { class: 'small', style: { color: 'var(--text-2)', lineHeight: 1.6, paddingLeft: '18px', margin: '6px 0 10px' } },
      h('li', {}, `All 8 Phase 1 units passed (now ${unitsPassed()}).`),
      h('li', {}, `700+ words in your deck, most of them known or mastered (now ${words.total}, ${words.known + words.mastered} solid).`),
      h('li', {}, 'Unit 7 mock exam passed twice at 80% or better, a week apart.'),
      h('li', {}, 'You can hold a 5-minute conversation with her family about yourself, your family and your day without switching to English.')),
    h('div', { class: 'progress' }, h('i', { style: { width: Math.round(unitsPassed() / 8 * 100) + '%' } })),
    h('div', { class: 'small muted', style: { marginTop: '6px' } }, `${unitsPassed()} of 8 Phase 1 units passed · ${ACTIVE_UNITS.length} available so far. Realistic timeline at 25 min/day: 5 to 7 months to exam-ready.`)));
  return el;
}

function standingCard(words) {
  const t = tierInfo(unitsPassed(), words.total);
  const { cur, next } = t;
  const idx = TIERS.indexOf(cur);
  return h('div', { class: 'card' }, h('h3', {}, 'Where you stand'),
    h('div', { class: 'quick-stats', style: { gridTemplateColumns: '1fr 1fr' } },
      h('div', { class: 'qs', style: { textAlign: 'left' } }, h('span', {}, 'If you had grown up in Russia…'), h('b', { style: { fontSize: '1.05rem' } }, `🧒 ${cur.age}`), h('span', {}, cur.ageNote)),
      h('div', { class: 'qs', style: { textAlign: 'left' } }, h('span', {}, 'What you can actually do'), h('b', { style: { fontSize: '1.05rem' } }, `🎒 ${cur.use}`), h('span', {}, cur.useNote))),
    h('div', { class: 'row', style: { marginTop: '10px' } }, h('span', { class: 'pill accent' }, cur.cefr), cur.exam ? h('span', { class: 'pill gold' }, `Ready to sit: ${cur.exam}`) : null),
    h('div', { class: 'progress mt' }, h('i', { style: { width: Math.round((idx + 1) / TIERS.length * 100) + '%' } })),
    next ? h('p', { class: 'small', style: { margin: '8px 0 0' } }, `Next: ${next.use} (${next.age}). Needs ${next.units} units passed and ${next.words} words in your deck. You have ${t.unitsPassed} and ${t.wordsKnown}.`) : h('p', { class: 'small' }, 'Top tier in this course.'),
    h('p', { class: 'small muted', style: { margin: '8px 0 0' } }, 'The age comparison is about what you can do, not how you sound. A five-year-old native knows thousands of words you do not; you know grammar they could not explain. Tiers are tied to the CEFR scale that TORFL uses, so they only move when real tests here say so.'));
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
