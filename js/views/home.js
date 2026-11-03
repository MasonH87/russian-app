// Dashboard: daily goal, streak, today's session plan, word of the day.
import { h, todayKey, toast, navigate } from '../util.js';
import { state, save, xpToday, currentStreak, DAILY, claimDaily, dailyClaimed, goalChestToday } from '../state.js';
import { dueCount, masteryCounts, addItem } from '../srs.js';
import { nextStep, pendingHomework, gate, wordId } from '../content.js';
import { phraseOfTheDay, PHRASE_GROUPS } from '../../data/phrases.js';
import { levelInfo } from '../gamify.js';
import { openLesson, openTest } from './lesson.js';
import { audioBtn } from '../exercises.js';
import { ttsSupported, hasRussianVoice } from '../audio.js';
import { avatarEmoji, titleText } from '../shop.js';

const qs = (ico, val, label) => h('div', { class: 'qs' }, h('b', {}, `${ico} ${val}`), h('span', {}, label));

function greeting(pct, due) {
  const hr = new Date().getHours();
  const ru = hr < 12 ? 'Доброе утро' : hr < 18 ? 'Добрый день' : 'Добрый вечер';
  if (pct >= 100) return `${ru}! Daily goal done. Anything extra is bonus.`;
  if (due) return `${ru}! ${due} card${due === 1 ? '' : 's'} waiting for review.`;
  return `${ru}! Ready for today's session?`;
}

function welcomeCard() {
  const input = h('input', { class: 'text', type: 'text', placeholder: 'Your name (as she says it, or in Cyrillic)', maxlength: 30 });
  return h('div', { class: 'card accent' },
    h('h2', {}, 'Добро пожаловать! Welcome!'),
    h('p', {}, 'This course takes you from zero to reading Cyrillic and holding simple conversations, in 20 to 30 minutes a day. Every lesson ends with a small homework task to do with your partner.'),
    h('div', { class: 'row' }, input, h('button', { class: 'btn gold', type: 'button', onclick: () => { state.settings.name = input.value.trim(); save(); location.reload(); } }, 'Start')));
}

function step(num, title, sub, done, onclick, href) {
  const inner = [h('div', { class: 'num' }, done ? '✓' : num), h('div', { class: 'body' }, h('b', {}, title), h('span', {}, sub)), h('div', { class: 'go' }, '›')];
  return href ? h('a', { class: `step${done ? ' done' : ''}`, href }, inner) : h('button', { class: `step${done ? ' done' : ''}`, type: 'button', onclick, style: { textAlign: 'left', width: '100%' } }, inner);
}

export function render() {
  const name = state.settings.name;
  const goal = state.dailyGoal, today = xpToday();
  const pct = Math.min(100, Math.round(today / goal * 100));
  const due = dueCount(), next = nextStep(), hw = pendingHomework().length, lvl = levelInfo();
  const words = masteryCounts(id => id.startsWith('w:')), letters = masteryCounts(id => id.startsWith('l:'));
  const lessonToday = Object.values(state.lessons).some(l => l.lastAt && todayKey(new Date(l.lastAt)) === todayKey());
  const el = h('div');
  if (!name && !state.xp) el.append(welcomeCard());

  el.append(h('div', { class: 'card' },
    h('div', { class: 'hero' },
      h('div', { class: 'row', style: { flexWrap: 'nowrap' } }, h('div', { class: 'avatar' }, avatarEmoji()), h('div', {}, h('h1', { style: { marginBottom: 0 } }, name ? `Привет, ${name}!` : 'Привет!'), titleText() ? h('div', { class: 'title-tag' }, titleText()) : null, h('p', { style: { margin: '4px 0 0' } }, greeting(pct, due)))),
      h('div', { class: 'ring', style: { '--p': pct } }, h('div', {}, h('b', {}, today), h('span', {}, `/ ${goal} XP`)))),
    h('div', { class: 'quick-stats' },
      qs('🔥', currentStreak(), state.streak.freezes ? `streak · ${state.streak.freezes} freeze${state.streak.freezes > 1 ? 's' : ''}` : 'day streak'),
      qs('📚', words.total, 'words'),
      qs('🔤', `${letters.total}/33`, 'letters'))));

  el.append(h('div', { class: 'card' }, h('h2', {}, "Today's session"), h('p', { class: 'small' }, 'About 25 minutes: review, one lesson, then homework with your partner.'),
    h('div', { class: 'session-steps' },
      step(1, 'Review', due ? `${due} card${due === 1 ? '' : 's'} due` : words.total + letters.total ? 'Nothing due. Optional practice.' : 'Your deck fills as you complete lessons.', !due, null, '#/review'),
      !next ? step(2, 'All lessons complete', 'More units are on the way. Keep reviewing!', true, null, '#/learn')
        : next.gated ? step(2, `🔒 ${next.type === 'lesson' ? next.lesson.title : next.unit.test.title}`, gate().type === 'checkpoint' ? 'Locked until you pass the checkpoint quiz' : 'Locked until your reviews are cleared', false, null, '#/learn')
        : step(2, next.type === 'lesson' ? `Lesson: ${next.lesson.title}` : `Test: ${next.unit.test.title}`, next.type === 'lesson' ? `${next.unit.icon} ${next.unit.title}` : `Pass mark ${next.unit.test.passMark}%`, lessonToday, () => next.type === 'lesson' ? openLesson(next.lesson.id) : openTest(next.unit.id)),
      step(3, 'Homework', hw ? `${hw} task${hw === 1 ? '' : 's'} to do with your partner` : 'All caught up', !hw, null, '#/homework'))));

  el.append(chestCard());

  const pod = phraseOfTheDay();
  const podId = wordId(pod.ru);
  const inDeck = !!state.srs[podId];
  const group = PHRASE_GROUPS.find(g => g.id === pod.group);
  el.append(h('div', { class: 'card pod' }, h('div', { class: 'spread' }, h('h3', {}, 'Phrase of the day'), h('span', { class: 'pill accent' }, `${group.icon} ${group.title}`)),
    h('div', { class: 'wod' }, audioBtn(pod.ru, { cls: 'sm' }), h('div', {}, h('div', { class: 'big', lang: 'ru' }, pod.ru), h('div', { class: 'muted' }, pod.en))),
    pod.lit ? h('div', { class: 'small muted', style: { marginTop: '6px' } }, `literally: ${pod.lit}`) : null,
    pod.note ? h('p', { class: 'small', style: { margin: '6px 0 0' } }, pod.note) : null,
    h('div', { class: 'row mt' },
      h('button', { class: `btn sm ${inDeck ? 'secondary' : 'green'}`, type: 'button', disabled: inDeck, onclick: () => { addItem(podId); save(); toast('Added to your review deck', 'green'); navigate('#/home'); } }, inDeck ? '✓ In your deck' : '+ Add to my deck'),
      h('a', { class: 'btn ghost sm', href: '#/phrases' }, 'All phrases ›'))));

  el.append(h('div', { class: 'grid-2' },
    h('a', { class: 'card soft', href: '#/alphabet' }, h('h3', {}, '🔤 Alphabet reference'), h('p', { class: 'small', style: { margin: 0 } }, 'All 33 letters with sounds and audio. Tap any letter.')),
    h('a', { class: 'card soft', href: '#/profile' }, h('h3', {}, `⭐ Level ${lvl.level}`), h('div', { class: 'progress gold' }, h('i', { style: { width: lvl.pct + '%' } })), h('p', { class: 'small', style: { margin: '6px 0 0' } }, `${lvl.into}/${lvl.need} XP to level ${lvl.level + 1}`))));

  setTimeout(() => {
    if (!hasRussianVoice()) el.prepend(h('div', { class: 'card soft', style: { borderColor: 'var(--gold)' } }, h('h3', {}, navigator.onLine ? '🔈 Using online Russian audio' : '🔈 No Russian voice found'),
      h('p', { class: 'small', style: { margin: 0 } }, navigator.onLine
        ? 'Your device has no Russian voice installed, so audio is fetched online (needs a connection). For reliable audio, install a Windows voice: Settings → Time & Language → Speech → Manage voices → Add voices → Русский. Then restart the browser. Settings → Audio has a diagnostics panel.'
        : 'You are offline and your device has no Russian voice, so audio is unavailable right now. Reconnect, or install a Windows voice: Settings → Time & Language → Speech → Manage voices → Add voices → Русский.')));
  }, 800);
  return el;
}

function chestCard() {
  const claimed = dailyClaimed(), goal = goalChestToday();
  const today = xpToday();
  if (!claimed) return h('div', { class: 'card accent chest' }, h('div', { class: 'big-ico' }, '🎁'),
    h('div', { style: { flex: 1 } }, h('h3', {}, 'Daily chest'), h('p', { style: { margin: 0 } }, `₽${DAILY.login} for showing up today. Hit your ${state.dailyGoal} XP goal for a second chest worth ₽${DAILY.goal}.`)),
    h('button', { class: 'btn gold', type: 'button', onclick: () => { const n = claimDaily(); toast(`+₽${n} · Daily chest opened`, 'gold'); navigate('#/home'); } }, `Claim ₽${DAILY.login}`));
  return h('div', { class: `card soft chest${goal ? ' done' : ''}` }, h('div', { class: 'big-ico' }, goal ? '✅' : '🎁'),
    h('div', { style: { flex: 1 } }, h('b', {}, goal ? 'Both chests opened today' : 'Daily chest claimed'),
      h('div', { class: 'small muted' }, goal ? `₽${DAILY.login} + ₽${DAILY.goal} earned. Come back tomorrow for more.` : `Goal chest: ₽${DAILY.goal} when you reach ${state.dailyGoal} XP today (${today}/${state.dailyGoal}).`)));
}
