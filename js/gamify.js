// XP levels, badges, and reward helpers.
import { state, save, currentStreak } from './state.js';
import { masteryCounts } from './srs.js';

export const XP = { correct: 10, perfectBonus: 20, review: 5, homework: 15, homeworkConfirmed: 10, testPass: 50 };

/** XP needed to go from level n to n+1 */
export const xpForLevel = n => 100 + 50 * (n - 1);
export function levelInfo(xp = state.xp) {
  let level = 1, rem = xp;
  while (rem >= xpForLevel(level)) { rem -= xpForLevel(level); level++; }
  const need = xpForLevel(level);
  return { level, into: rem, need, pct: Math.round(rem / need * 100), title: levelTitle(level) };
}
function levelTitle(l) {
  if (l < 3) return 'Новичок · Newcomer';
  if (l < 6) return 'Ученик · Student';
  if (l < 10) return 'Читатель · Reader';
  if (l < 15) return 'Собеседник · Conversationalist';
  if (l < 22) return 'Знаток · Expert';
  return 'Мастер · Master';
}

export const BADGES = [
  { id: 'first-lesson', ico: '🌱', name: 'Первый шаг', desc: 'Complete your first lesson', check: s => Object.values(s.lessons).some(l => l.completed) },
  { id: 'alphabet', ico: '🔤', name: 'Азбука', desc: 'Pass the alphabet exam', check: s => s.tests['u0-test']?.passed },
  { id: 'perfect', ico: '💯', name: 'Отлично!', desc: 'Finish a lesson with 100% accuracy', check: s => Object.values(s.lessons).some(l => l.best === 100) },
  { id: 'streak-3', ico: '🔥', name: 'Три дня', desc: '3-day streak', check: () => currentStreak() >= 3 },
  { id: 'streak-7', ico: '🗓️', name: 'Неделя', desc: '7-day streak', check: () => currentStreak() >= 7 },
  { id: 'streak-30', ico: '🏆', name: 'Месяц', desc: '30-day streak', check: () => currentStreak() >= 30 },
  { id: 'words-25', ico: '📚', name: '25 слов', desc: 'Learn 25 words', check: () => masteryCounts(id => id.startsWith('w:')).total >= 25 },
  { id: 'words-100', ico: '📖', name: '100 слов', desc: 'Learn 100 words', check: () => masteryCounts(id => id.startsWith('w:')).total >= 100 },
  { id: 'mastered-10', ico: '🧠', name: 'Крепкая память', desc: 'Master 10 words (3+ week interval)', check: () => masteryCounts(id => id.startsWith('w:')).mastered >= 10 },
  { id: 'reviews-50', ico: '🔁', name: 'Повторение', desc: 'Answer 50 review cards', check: s => s.reviews >= 50 },
  { id: 'homework-1', ico: '📝', name: 'Домашка', desc: 'Complete a homework task', check: s => Object.values(s.homework).some(h => h.done) },
  { id: 'partner-3', ico: '💞', name: 'Вместе', desc: 'Have 3 homework tasks confirmed by your partner', check: s => Object.values(s.homework).filter(h => h.confirmed).length >= 3 },
  { id: 'unit1', ico: '🎓', name: 'Unit 1', desc: 'Pass the Unit 1 test', check: s => s.tests['u1-test']?.passed },
  { id: 'level-5', ico: '⭐', name: 'Level 5', desc: 'Reach level 5', check: s => levelInfo(s.xp).level >= 5 },
  { id: 'xp-1000', ico: '💎', name: '1000 XP', desc: 'Earn 1000 XP', check: s => s.xp >= 1000 },
];

/** Check all badges; returns newly earned badge objects. */
export function checkBadges() {
  const earned = [];
  for (const b of BADGES) {
    if (state.badges[b.id]) continue;
    try { if (b.check(state)) { state.badges[b.id] = Date.now(); earned.push(b); } } catch { /* ignore */ }
  }
  if (earned.length) save();
  return earned;
}

/**
 * Where you stand: a native-speaker age equivalent, a usefulness tier, and the matching exam level.
 * The age is honest-but-rough: an adult learner has adult grammar awareness and a child's vocabulary,
 * so the comparison is about what you can *do*, not how you sound.
 */
export const TIERS = [
  { id: 0, units: 0, words: 0, age: 'Newborn', ageNote: 'Hears the sounds, no words yet', use: 'Decoder', useNote: 'Learning to read the alphabet', cefr: 'Pre-A1', exam: null },
  { id: 1, units: 1, words: 20, age: 'About 1 year old', ageNote: 'First words, recognises names', use: 'Sign reader', useNote: 'Can sound out signs, menus and names aloud', cefr: 'Pre-A1', exam: null },
  { id: 2, units: 2, words: 60, age: '1½ to 2 years', ageNote: 'Single words and set phrases', use: 'Polite tourist', useNote: 'Greet, thank, apologise, introduce yourself, say where you are from', cefr: 'A1 starting', exam: null },
  { id: 3, units: 3, words: 150, age: '2 to 2½ years', ageNote: 'Two-word sentences, counting, family', use: 'Survival tourist', useNote: 'Talk about family, count, give ages, say what you have', cefr: 'A1 starting', exam: null },
  { id: 4, units: 4, words: 250, age: '2½ to 3 years', ageNote: 'Simple present-tense sentences', use: 'Small-talk starter', useNote: 'Say what you do, like and want in the present tense', cefr: 'A1', exam: null },
  { id: 5, units: 6, words: 450, age: '3 to 4 years', ageNote: 'Short sentences with place and object', use: 'Basic conversationalist', useNote: 'Shops, cafés, directions, simple plans', cefr: 'A1', exam: null },
  { id: 6, units: 8, words: 700, age: '4 to 5 years (with an adult’s grammar and a child’s vocabulary)', ageNote: 'Past and present, everyday topics', use: 'Independent tourist', useNote: 'Handle daily life in Russia without English', cefr: 'A1 · TORFL Elementary', exam: 'TORFL Elementary (ТЭУ)' },
  { id: 7, units: 14, words: 1300, age: '5 to 6 years', ageNote: 'Tells simple stories, argues a point', use: 'Everyday conversationalist', useNote: 'Sustain a real conversation with her family', cefr: 'A2 · TORFL Basic', exam: 'TORFL Basic (ТБУ)' },
  { id: 8, units: 22, words: 2300, age: '7 to 9 years', ageNote: 'Reads simple texts, follows TV', use: 'Working conversationalist', useNote: 'Work, news, opinions', cefr: 'B1 · TORFL First', exam: 'TORFL First (ТРКИ-I)' },
];
export function tierInfo(unitsPassed, wordsKnown) {
  let cur = TIERS[0];
  for (const t of TIERS) if (unitsPassed >= t.units && wordsKnown >= t.words) cur = t;
  const next = TIERS[cur.id + 1] || null;
  return { cur, next, unitsPassed, wordsKnown };
}
/** Kept for compatibility. */
export function cefrEstimate(unitsPassed) {
  const t = tierInfo(unitsPassed, 99999).cur;
  return { label: t.cefr, note: t.use };
}
