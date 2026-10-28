// Inventory: everything you own, with equip controls and rarity breakdown.
import { h, toast, navigate, stripStress } from '../util.js';
import { state } from '../state.js';
import { ALL_ITEMS, BOX_ITEMS, RARITIES, rarity, owned, equip, avatarEmoji, titleText, equipped } from '../shop.js';
import { speak } from '../audio.js';

const KINDS = [['avatar', '🙂 Avatars'], ['title', '🏷️ Titles'], ['theme', '🎨 Themes']];

export function render() {
  const mine = ALL_ITEMS.filter(i => owned(i.id) && i.kind !== 'boost');
  const boxMine = mine.filter(i => i.box);
  const el = h('div');
  el.append(h('div', { class: 'spread' }, h('h1', {}, 'Inventory · Инвентарь'), h('a', { class: 'btn gold sm', href: '#/shop' }, `₽ ${state.coins} · Shop`)));

  // Equipped summary
  const th = equipped('theme');
  el.append(h('div', { class: 'card' },
    h('div', { class: 'row' }, h('div', { class: 'avatar lg' }, avatarEmoji()),
      h('div', {}, h('h2', { style: { marginBottom: 0 } }, state.settings.name || 'You'), h('div', { class: 'title-tag' }, titleText() ? stripStress(titleText()) : 'no title'), h('div', { class: 'small muted' }, `Theme: ${th ? stripStress(th.name) : 'default'}`))),
    h('div', { class: 'quick-stats' },
      h('div', { class: 'qs' }, h('b', {}, mine.length), h('span', {}, 'items owned')),
      h('div', { class: 'qs' }, h('b', {}, `${boxMine.length}/${BOX_ITEMS.length}`), h('span', {}, 'box collection')),
      h('div', { class: 'qs' }, h('b', {}, `🧊 ${state.streak.freezes} · ⚡ ${state.shop.boosts.doubleXP}`), h('span', {}, 'boosts held')))));

  // Rarity breakdown
  el.append(h('div', { class: 'card soft' }, h('h3', {}, 'By rarity'),
    h('div', { class: 'rarity-bars' }, RARITIES.map(r => {
      const total = BOX_ITEMS.filter(i => i.rarity === r.id).length, have = boxMine.filter(i => i.rarity === r.id).length;
      return h('div', { class: 'rbar', style: { '--c': r.color } }, h('span', {}, `${stripStress(r.ru)} · ${r.en}`), h('div', { class: 'progress' }, h('i', { style: { width: total ? Math.round(have / total * 100) + '%' : '0%', background: r.color } })), h('b', {}, `${have}/${total}`));
    }))));

  if (!mine.length) el.append(h('div', { class: 'card' }, h('h3', {}, 'Nothing here yet'), h('p', {}, 'Earn rubles by studying, then buy items or open a Матрёшка box. Everything you own shows up here and becomes a vocabulary card.'), h('a', { class: 'btn', href: '#/shop' }, 'Go to the shop')));

  for (const [kind, title] of KINDS) {
    const items = mine.filter(i => i.kind === kind).sort((a, b) => rank(b) - rank(a));
    if (!items.length) continue;
    el.append(h('div', { class: 'card' }, h('h3', {}, `${title} · ${items.length}`), h('p', { class: 'small' }, 'Tap to equip or unequip. Tap 🔊 to hear the word.'), h('div', { class: 'shop-grid' }, items.map(card))));
  }
  return el;
}
const rank = it => it.rarity ? RARITIES.findIndex(r => r.id === it.rarity) : -1;

function card(it) {
  const eq = state.shop.equipped[it.kind] === it.id;
  const r = it.rarity ? rarity(it.rarity) : null;
  const visual = it.kind === 'theme'
    ? h('div', { class: 'swatch', style: { background: `linear-gradient(135deg, ${it.swatch[0]}, ${it.swatch[1]})` } })
    : h('div', { class: 'shop-emoji' }, it.emoji || '🏷️');
  return h('button', { type: 'button', class: `shop-item inv${eq ? ' equipped' : ''}${r ? ' tier' : ''}`, style: r ? { '--c': r.color } : null,
    onclick: () => { equip(it.id); toast(eq ? 'Unequipped' : `Equipped ${stripStress(it.name)}`); navigate('#/inventory'); } },
    visual, h('b', { lang: 'ru' }, it.name), h('span', { class: 'small muted' }, it.en),
    h('span', { class: 'small', style: { color: r ? r.color : 'var(--muted)', fontWeight: 700 } }, r ? stripStress(r.ru) : 'Магазин · Shop'),
    h('span', { class: `pill${eq ? ' gold' : ''}` }, eq ? 'Equipped' : 'Tap to equip'),
    h('span', { class: 'audio-btn inline', role: 'button', onclick: e => { e.stopPropagation(); speak(it.ru || it.name); } }, '🔊'));
}
