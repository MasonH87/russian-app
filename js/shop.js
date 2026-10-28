// The shop: cosmetics and a few boosts, paid for with rubles (₽) earned alongside XP.
import { state, save, spendCoins } from './state.js';
import { addItem } from './srs.js';
import { norm } from './util.js';

export const COINS = { perfectLesson: 5, firstPass: 10, testPass: 25, homework: 5, partnerConfirmed: 5, weekStreak: 15 };

export const ITEMS = [
  // Avatars (name = Russian word, learned as vocabulary when bought)
  { id: 'av-cat', kind: 'avatar', emoji: '🐱', name: 'Кот', ru: 'кот', en: 'Cat', price: 25 },
  { id: 'av-pelmen', kind: 'avatar', emoji: '🥟', name: 'Пельмень', ru: 'пельме́нь', en: 'Dumpling', price: 25 },
  { id: 'av-bear', kind: 'avatar', emoji: '🐻', name: 'Медведь', ru: 'медве́дь', en: 'Bear', price: 30 },
  { id: 'av-matryoshka', kind: 'avatar', emoji: '🪆', name: 'Матрёшка', ru: 'матрёшка', en: 'Matryoshka', price: 30 },
  { id: 'av-fox', kind: 'avatar', emoji: '🦊', name: 'Лиса', ru: 'лиса́', en: 'Fox', price: 30 },
  { id: 'av-skater', kind: 'avatar', emoji: '⛸️', name: 'Фигурист', ru: 'фигури́ст', en: 'Figure skater', price: 35 },
  { id: 'av-violin', kind: 'avatar', emoji: '🎻', name: 'Скрипач', ru: 'скрипа́ч', en: 'Violinist', price: 35 },
  { id: 'av-wolf', kind: 'avatar', emoji: '🐺', name: 'Волк', ru: 'волк', en: 'Wolf', price: 40 },
  { id: 'av-rocket', kind: 'avatar', emoji: '🚀', name: 'Ракета', ru: 'раке́та', en: 'Rocket', price: 40 },
  { id: 'av-kremlin', kind: 'avatar', emoji: '🏰', name: 'Кремль', ru: 'Кремль', en: 'Kremlin', price: 50 },
  { id: 'av-crown', kind: 'avatar', emoji: '👑', name: 'Корона', ru: 'коро́на', en: 'Crown', price: 120 },
  // Titles (shown under your name)
  { id: 't-comrade', kind: 'title', name: 'Товарищ', ru: 'това́рищ', en: 'Comrade', price: 20 },
  { id: 't-student', kind: 'title', name: 'Отличник', ru: 'отли́чник', en: 'Straight-A student', price: 40 },
  { id: 't-hockey', kind: 'title', name: 'Хоккеист', ru: 'хоккеи́ст', en: 'Hockey player', price: 50 },
  { id: 't-cosmonaut', kind: 'title', name: 'Космонавт', ru: 'космона́вт', en: 'Cosmonaut', price: 60 },
  { id: 't-ballet', kind: 'title', name: 'Балерина', ru: 'балери́на', en: 'Ballerina', price: 60 },
  { id: 't-siberian', kind: 'title', name: 'Сибиряк', ru: 'сибиря́к', en: 'Siberian', price: 80 },
  { id: 't-tsar', kind: 'title', name: 'Царь', ru: 'царь', en: 'Tsar', price: 100 },
  { id: 't-tsarina', kind: 'title', name: 'Царица', ru: 'цари́ца', en: 'Tsarina', price: 100 },
  { id: 't-professor', kind: 'title', name: 'Профессор', ru: 'профе́ссор', en: 'Professor', price: 120 },
  { id: 't-champion', kind: 'title', name: 'Чемпион', ru: 'чемпио́н', en: 'Champion', price: 150 },
  // Colour themes
  { id: 'th-red', kind: 'theme', name: 'Красная площадь', ru: 'Кра́сная пло́щадь', en: 'Red Square', price: 80, swatch: ['#e63946', '#ffd166'] },
  { id: 'th-aurora', kind: 'theme', name: 'Северное сияние', ru: 'се́верное сия́ние', en: 'Northern lights', price: 80, swatch: ['#2dd4bf', '#a3e635'] },
  { id: 'th-winter', kind: 'theme', name: 'Зима', ru: 'зима́', en: 'Winter', price: 80, swatch: ['#7dd3fc', '#e0f2fe'] },
  { id: 'th-sunset', kind: 'theme', name: 'Закат', ru: 'зака́т', en: 'Sunset', price: 80, swatch: ['#fb923c', '#f472b6'] },
  { id: 'th-emerald', kind: 'theme', name: 'Изумруд', ru: 'изумру́д', en: 'Emerald', price: 80, swatch: ['#34d399', '#fbbf24'] },
  // Boosts
  { id: 'b-freeze', kind: 'boost', emoji: '🧊', name: 'Защита серии', en: 'Streak freeze', desc: 'Covers one missed day. You can hold up to 3.', price: 50, max: 3 },
  { id: 'b-double', kind: 'boost', emoji: '⚡', name: 'Двойной опыт', en: 'Double XP', desc: 'Doubles the XP of your next lesson or test. You can hold up to 2.', price: 40, max: 2 },
];

/* ───── Mystery box (Матрёшка): CS:GO-style case with rarity tiers ───── */
export const BOX = { id: 'box', price: 60, name: 'Матрёшка', en: 'Mystery box' };
export const RARITIES = [
  { id: 'common', ru: 'Обычный', en: 'Common', color: '#9fb0c3', weight: 50, value: 10 },
  { id: 'uncommon', ru: 'Необычный', en: 'Uncommon', color: '#5e98d9', weight: 25, value: 20 },
  { id: 'rare', ru: 'Редкий', en: 'Rare', color: '#4b69ff', weight: 13, value: 40 },
  { id: 'epic', ru: 'Очень редкий', en: 'Epic', color: '#8847ff', weight: 7, value: 80 },
  { id: 'mythic', ru: 'Мифический', en: 'Mythic', color: '#d32ce6', weight: 3.2, value: 120 },
  { id: 'legendary', ru: 'Легендарный', en: 'Legendary', color: '#eb4b4b', weight: 1.5, value: 200 },
  { id: 'exceptional', ru: 'Исключительный', en: 'Exceptional', color: '#e4ae39', weight: 0.3, value: 400 },
];
export const rarity = id => RARITIES.find(r => r.id === id);
const A = (id, emoji, ru, en, r) => ({ id: 'bx-' + id, kind: 'avatar', emoji, ru, name: ru, en, rarity: r, box: true });
export const BOX_ITEMS = [
  A('bread', '🍞', 'хлеб', 'bread', 'common'), A('cucumber', '🥒', 'огуре́ц', 'cucumber', 'common'), A('potato', '🥔', 'карто́шка', 'potato', 'common'),
  A('onion', '🧅', 'лук', 'onion', 'common'), A('tea', '☕', 'чай', 'tea', 'common'), A('milk', '🥛', 'молоко́', 'milk', 'common'),
  A('socks', '🧦', 'носки́', 'socks', 'common'), A('chicken', '🐔', 'ку́рица', 'chicken', 'common'), A('salt', '🧂', 'соль', 'salt', 'common'),
  A('apple', '🍎', 'я́блоко', 'apple', 'common'), A('egg', '🥚', 'яйцо́', 'egg', 'common'), A('key', '🔑', 'ключ', 'key', 'common'),
  A('scarf', '🧣', 'шарф', 'scarf', 'uncommon'), A('mittens', '🧤', 'ва́режки', 'mittens', 'uncommon'), A('blini', '🥞', 'блины́', 'pancakes', 'uncommon'),
  A('honey', '🍯', 'мёд', 'honey', 'uncommon'), A('tram', '🚃', 'трамва́й', 'tram', 'uncommon'), A('fir', '🌲', 'ёлка', 'fir tree', 'uncommon'),
  A('fish', '🐟', 'ры́ба', 'fish', 'uncommon'), A('hockey', '🏒', 'хокке́й', 'hockey', 'uncommon'), A('skis', '🎿', 'лы́жи', 'skis', 'uncommon'),
  A('hat', '🎩', 'ша́пка', 'hat', 'uncommon'), A('book', '📖', 'кни́га', 'book', 'uncommon'),
  A('ice', '🧊', 'лёд', 'ice', 'rare'), A('polarbear', '🐻‍❄️', 'бе́лый медве́дь', 'polar bear', 'rare'), A('mountain', '🏔️', 'гора́', 'mountain', 'rare'),
  A('train', '🚂', 'по́езд', 'train', 'rare'), A('piano', '🎹', 'пиани́но', 'piano', 'rare'), A('borscht', '🍲', 'борщ', 'borscht', 'rare'),
  A('theatre', '🏛️', 'теа́тр', 'theatre', 'rare'), A('ballet', '🩰', 'бале́т', 'ballet', 'rare'), A('samovar', '🫖', 'самова́р', 'samovar', 'rare'),
  A('cosmos', '🌌', 'ко́смос', 'cosmos', 'mythic'), A('sputnik', '🛰️', 'спу́тник', 'satellite', 'mythic'), A('reindeer', '🦌', 'оле́нь', 'reindeer', 'epic'),
  A('horse', '🐎', 'ло́шадь', 'horse', 'epic'), A('church', '⛪', 'це́рковь', 'church', 'epic'), A('fireworks', '🎆', 'салю́т', 'fireworks', 'mythic'),
  A('tiger', '🐯', 'тигр', 'tiger', 'legendary'), A('firebird', '🔥', 'жар-пти́ца', 'firebird', 'legendary'), A('snowmaiden', '❄️', 'Снегу́рочка', 'Snow Maiden', 'legendary'),
  A('frost', '🎅', 'Дед Моро́з', 'Grandfather Frost', 'legendary'), A('diamond', '💎', 'алма́з', 'diamond', 'legendary'),
  A('gold', '🥇', 'зо́лото', 'gold', 'exceptional'), A('star', '🌟', 'звезда́', 'star', 'exceptional'), A('trophy', '🏆', 'ку́бок', 'trophy', 'exceptional'),
  { id: 'bx-th-night', kind: 'theme', ru: 'Поля́рная ночь', name: 'Поля́рная ночь', en: 'Polar night', rarity: 'epic', box: true, swatch: ['#3b2d8f', '#0b1030'] },
  { id: 'bx-th-firebird', kind: 'theme', ru: 'Жар-пти́ца', name: 'Жар-пти́ца', en: 'Firebird', rarity: 'legendary', box: true, swatch: ['#ff3d00', '#ffd600'] },
  { id: 'bx-t-bogatyr', kind: 'title', ru: 'Богаты́рь', name: 'Богаты́рь', en: 'Bogatyr (epic hero)', rarity: 'mythic', box: true },
  { id: 'bx-t-polyglot', kind: 'title', ru: 'Полигло́т', name: 'Полигло́т', en: 'Polyglot', rarity: 'rare', box: true },
  { id: 'bx-t-tourist', kind: 'title', ru: 'Тури́ст', name: 'Тури́ст', en: 'Tourist', rarity: 'common', box: true },
];
export const ALL_ITEMS = [...ITEMS, ...BOX_ITEMS];
export const byId = id => ALL_ITEMS.find(i => i.id === id);

function rollRarity() {
  const total = RARITIES.reduce((n, r) => n + r.weight, 0);
  let x = Math.random() * total;
  for (const r of RARITIES) { x -= r.weight; if (x <= 0) return r; }
  return RARITIES[0];
}
/** Pick a random box item (does not spend anything). */
export function rollBox() {
  const r = rollRarity();
  const pool = BOX_ITEMS.filter(i => i.rarity === r.id);
  return pool[Math.floor(Math.random() * pool.length)];
}
/** Spend the box price and award an item. Returns {ok, item, dup, refund} */
export function openBox() {
  if (!spendCoins(BOX.price)) return { ok: false, reason: 'Not enough rubles yet.' };
  const item = rollBox();
  const dup = owned(item.id);
  let refund = 0;
  if (dup) { refund = Math.round(rarity(item.rarity).value * 0.5); state.coins += refund; }
  else { state.shop.owned.push(item.id); learnWord(item); }
  state.shop.boxesOpened = (state.shop.boxesOpened || 0) + 1;
  save();
  return { ok: true, item, dup, refund };
}
/** Owned items become vocabulary cards. */
function learnWord(it) {
  const ru = it.ru || it.name;
  if (ru) addItem('w:' + norm(ru));
}
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
  learnWord(it);
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
