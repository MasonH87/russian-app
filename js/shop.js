// The shop: cosmetics and a few boosts, paid for with rubles (₽) earned alongside XP.
import { state, save, spendCoins } from './state.js';

export const COINS = { perfectLesson: 5, firstPass: 10, testPass: 25, homework: 5, partnerConfirmed: 5, weekStreak: 15 };

export const ITEMS = [
  // Avatars
  { id: 'av-cat', kind: 'avatar', emoji: '🐱', name: 'Кот', en: 'Cat', price: 25 },
  { id: 'av-pelmen', kind: 'avatar', emoji: '🥟', name: 'Пельмень', en: 'Dumpling', price: 25 },
  { id: 'av-bear', kind: 'avatar', emoji: '🐻', name: 'Медведь', en: 'Bear', price: 30 },
  { id: 'av-matryoshka', kind: 'avatar', emoji: '🪆', name: 'Матрёшка', en: 'Matryoshka', price: 30 },
  { id: 'av-fox', kind: 'avatar', emoji: '🦊', name: 'Лиса', en: 'Fox', price: 30 },
  { id: 'av-skater', kind: 'avatar', emoji: '⛸️', name: 'Фигурист', en: 'Figure skater', price: 35 },
  { id: 'av-violin', kind: 'avatar', emoji: '🎻', name: 'Скрипач', en: 'Violinist', price: 35 },
  { id: 'av-wolf', kind: 'avatar', emoji: '🐺', name: 'Волк', en: 'Wolf', price: 40 },
  { id: 'av-rocket', kind: 'avatar', emoji: '🚀', name: 'Космонавт', en: 'Cosmonaut', price: 40 },
  { id: 'av-kremlin', kind: 'avatar', emoji: '🏰', name: 'Кремль', en: 'Kremlin', price: 50 },
  { id: 'av-crown', kind: 'avatar', emoji: '👑', name: 'Корона', en: 'Crown', price: 120 },
  // Titles (shown under your name)
  { id: 't-comrade', kind: 'title', name: 'Товарищ', en: 'Comrade', price: 20 },
  { id: 't-student', kind: 'title', name: 'Отличник', en: 'Straight-A student', price: 40 },
  { id: 't-hockey', kind: 'title', name: 'Хоккеист', en: 'Hockey player', price: 50 },
  { id: 't-cosmonaut', kind: 'title', name: 'Космонавт', en: 'Cosmonaut', price: 60 },
  { id: 't-ballet', kind: 'title', name: 'Балерина', en: 'Ballerina', price: 60 },
  { id: 't-siberian', kind: 'title', name: 'Сибиряк', en: 'Siberian', price: 80 },
  { id: 't-tsar', kind: 'title', name: 'Царь', en: 'Tsar', price: 100 },
  { id: 't-tsarina', kind: 'title', name: 'Царица', en: 'Tsarina', price: 100 },
  { id: 't-professor', kind: 'title', name: 'Профессор', en: 'Professor', price: 120 },
  { id: 't-champion', kind: 'title', name: 'Чемпион', en: 'Champion', price: 150 },
  // Colour themes
  { id: 'th-red', kind: 'theme', name: 'Красная площадь', en: 'Red Square', price: 80, swatch: ['#e63946', '#ffd166'] },
  { id: 'th-aurora', kind: 'theme', name: 'Северное сияние', en: 'Northern lights', price: 80, swatch: ['#2dd4bf', '#a3e635'] },
  { id: 'th-winter', kind: 'theme', name: 'Зима', en: 'Winter', price: 80, swatch: ['#7dd3fc', '#e0f2fe'] },
  { id: 'th-sunset', kind: 'theme', name: 'Закат', en: 'Sunset', price: 80, swatch: ['#fb923c', '#f472b6'] },
  { id: 'th-emerald', kind: 'theme', name: 'Изумруд', en: 'Emerald', price: 80, swatch: ['#34d399', '#fbbf24'] },
  // Boosts
  { id: 'b-freeze', kind: 'boost', emoji: '🧊', name: 'Защита серии', en: 'Streak freeze', desc: 'Covers one missed day. You can hold up to 3.', price: 50, max: 3 },
  { id: 'b-double', kind: 'boost', emoji: '⚡', name: 'Двойной опыт', en: 'Double XP', desc: 'Doubles the XP of your next lesson or test. You can hold up to 2.', price: 40, max: 2 },
];

export const byId = id => ITEMS.find(i => i.id === id);
export const owned = id => state.shop.owned.includes(id);
export const equipped = kind => byId(state.shop.equipped[kind]);
export const avatarEmoji = () => equipped('avatar')?.emoji || '🙂';
export const titleText = () => equipped('title')?.name || '';

/** Returns {ok, reason}. */
export function buy(id) {
  const it = byId(id); if (!it) return { ok: false, reason: 'Unknown item' };
  if (it.kind === 'boost') {
    const held = it.id === 'b-freeze' ? state.streak.freezes : state.shop.boosts.doubleXP;
    if (held >= it.max) return { ok: false, reason: `You already hold the maximum (${it.max}).` };
    if (!spendCoins(it.price)) return { ok: false, reason: 'Not enough rubles yet.' };
    if (it.id === 'b-freeze') state.streak.freezes += 1; else state.shop.boosts.doubleXP += 1;
    save(); return { ok: true };
  }
  if (owned(id)) return { ok: false, reason: 'Already owned.' };
  if (!spendCoins(it.price)) return { ok: false, reason: 'Not enough rubles yet.' };
  state.shop.owned.push(id);
  state.shop.equipped[it.kind] = id;
  save(); applyTheme();
  return { ok: true };
}
export function equip(id) {
  const it = byId(id); if (!it || !owned(id)) return;
  state.shop.equipped[it.kind] = state.shop.equipped[it.kind] === id ? '' : id;
  save(); applyTheme();
}
/** Consume a double-XP token if one is held. Returns true if consumed. */
export function useDoubleXP() {
  if (state.shop.boosts.doubleXP > 0) { state.shop.boosts.doubleXP -= 1; save(); return true; }
  return false;
}
export function applyTheme() {
  const t = equipped('theme');
  document.documentElement.dataset.accent = t ? t.id : '';
}
