// Shop page.
import { h, toast, navigate } from '../util.js';
import { state } from '../state.js';
import { ITEMS, owned, buy, equip, COINS, avatarEmoji, titleText } from '../shop.js';

const KINDS = [
  ['avatar', '🙂 Avatars', 'Shown next to your name on Home and Profile.'],
  ['title', '🏷️ Titles', 'A Russian title under your name.'],
  ['theme', '🎨 Colour themes', 'Recolours the whole app.'],
  ['boost', '⚡ Boosts', 'Useful things. They do not skip any mastery rules.'],
];

export function render() {
  const el = h('div');
  el.append(h('div', { class: 'spread' }, h('h1', {}, 'Shop · Магазин'), h('span', { class: 'pill gold', style: { fontSize: '1rem' } }, `₽ ${state.coins}`)));
  el.append(h('div', { class: 'card accent' },
    h('div', { class: 'row' }, h('div', { style: { fontSize: '2.6rem' } }, avatarEmoji()), h('div', {}, h('h2', {}, state.settings.name || 'You'), titleText() ? h('div', {}, titleText()) : h('div', { class: 'muted' }, 'No title yet'))),
    h('p', { class: 'small mt' }, `You earn 1 ₽ per 10 XP, plus ₽${COINS.firstPass} for passing a lesson the first time, ₽${COINS.perfectLesson} for a perfect lesson, ₽${COINS.testPass} for a test, ₽${COINS.homework} per homework (+₽${COINS.partnerConfirmed} when she confirms), and ₽${COINS.weekStreak} every 7-day streak. Lifetime earned: ₽${state.coinsEarned}.`)));
  for (const [kind, title, desc] of KINDS) {
    const items = ITEMS.filter(i => i.kind === kind);
    el.append(h('div', { class: 'card' }, h('h3', {}, title), h('p', { class: 'small' }, desc), h('div', { class: 'shop-grid' }, items.map(card))));
  }
  return el;
}

function card(it) {
  const own = owned(it.id);
  const eq = state.shop.equipped[it.kind] === it.id;
  const held = it.id === 'b-freeze' ? state.streak.freezes : it.id === 'b-double' ? state.shop.boosts.doubleXP : 0;
  const visual = it.kind === 'theme'
    ? h('div', { class: 'swatch', style: { background: `linear-gradient(135deg, ${it.swatch[0]}, ${it.swatch[1]})` } })
    : h('div', { class: 'shop-emoji' }, it.emoji || '🏷️');
  const label = it.kind === 'boost' ? `Held: ${held}/${it.max}` : eq ? 'Equipped' : own ? 'Owned' : `₽ ${it.price}`;
  const btn = it.kind === 'boost'
    ? h('button', { class: 'btn gold sm', type: 'button', disabled: held >= it.max || state.coins < it.price, onclick: () => act(it) }, `Buy ₽${it.price}`)
    : own
      ? h('button', { class: `btn sm ${eq ? 'secondary' : 'green'}`, type: 'button', onclick: () => { equip(it.id); navigate('#/shop'); } }, eq ? 'Unequip' : 'Equip')
      : h('button', { class: 'btn gold sm', type: 'button', disabled: state.coins < it.price, onclick: () => act(it) }, `Buy ₽${it.price}`);
  return h('div', { class: `shop-item${eq ? ' equipped' : ''}${own ? ' owned' : ''}` }, visual,
    h('b', {}, it.name), h('span', { class: 'small muted' }, it.en + (it.desc ? ` · ${it.desc}` : '')), h('span', { class: 'pill' }, label), btn);
}
function act(it) {
  const r = buy(it.id);
  if (r.ok) toast(`Bought ${it.name}!`, 'gold'); else toast(r.reason, 'red');
  navigate('#/shop');
}
