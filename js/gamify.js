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

/** Rough CEFR estimate from unit progress. */
export function cefrEstimate(unitsPassed) {
  if (unitsPassed <= 0) return { label: 'Pre-A1', note: 'Learning the alphabet' };
  if (unitsPassed < 3) return { label: 'A1 (starting)', note: 'Survival phrases' };
  if (unitsPassed < 6) return { label: 'A1', note: 'TORFL Elementary range' };
  return { label: 'A1+ / A2', note: 'TORFL Basic range' };
}
