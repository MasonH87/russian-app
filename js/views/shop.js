// Shop page: rubles, cosmetics, boosts, and the Матрёшка mystery box with a case-opening reel.
import { h, toast, navigate, shuffle, stripStress } from '../util.js';
import { state } from '../state.js';
import { ITEMS, BOX, BOX_ITEMS, RARITIES, rarity, owned, buy, equip, openBox, COINS, avatarEmoji, titleText, byId } from '../shop.js';
import { speak } from '../audio.js';

const KINDS = [
  ['avatar', '🙂 Avatars', 'Shown next to your name. Each one is a Russian noun you learn.'],
  ['title', '🏷️ Titles', 'A Russian title under your name.'],
  ['theme', '🎨 Colour themes', 'Recolours the whole app.'],
  ['boost', '⚡ Boosts', 'Useful things. They do not skip any mastery rules.'],
];

export function render() {
  const el = h('div');
  el.append(h('div', { class: 'spread' }, h('h1', {}, 'Shop · Магазин'), h('span', { class: 'pill gold', style: { fontSize: '1rem' } }, `₽ ${state.coins}`)));
  el.append(h('div', { class: 'card accent' },
    h('div', { class: 'row' }, h('div', { style: { fontSize: '2.6rem' } }, avatarEmoji()), h('div', {}, h('h2', {}, state.settings.name || 'You'), titleText() ? h('div', {}, stripStress(titleText())) : h('div', { class: 'muted' }, 'No title yet'))),
    h('p', { class: 'small mt' }, `1 ₽ per 10 XP, plus ₽${COINS.firstPass} for a first lesson pass, ₽${COINS.perfectLesson} for a perfect lesson, ₽${COINS.testPass} per test, ₽${COINS.homework} per homework (+₽${COINS.partnerConfirmed} when she confirms), ₽${COINS.weekStreak} every 7-day streak. Everything you own becomes a vocabulary card. Lifetime earned: ₽${state.coinsEarned}.`)));

  el.append(boxCard());
  for (const [kind, title, desc] of KINDS) {
    const items = ITEMS.filter(i => i.kind === kind);
    el.append(h('div', { class: 'card' }, h('h3', {}, title), h('p', { class: 'small' }, desc), h('div', { class: 'shop-grid' }, items.map(card))));
  }
  el.append(h('a', { class: 'card soft', href: '#/inventory', style: { display: 'block' } }, h('h3', {}, '🎒 My inventory ›'), h('p', { class: 'small', style: { margin: 0 } }, `${BOX_ITEMS.filter(i => owned(i.id)).length}/${BOX_ITEMS.length} box items collected. Equip avatars, titles and themes from the Items tab.`)));
  return el;
}

/* ───── Mystery box ───── */
function boxCard() {
  const opened = state.shop.boxesOpened || 0;
  const total = RARITIES.reduce((n, r) => n + r.weight, 0);
  return h('div', { class: 'card box-card' },
    h('div', { class: 'spread' }, h('div', {}, h('h3', {}, `🪆 ${BOX.name} · ${BOX.en}`), h('p', { class: 'small', style: { margin: 0 } }, `${BOX_ITEMS.length} possible items across six rarity tiers. Duplicates refund half the item’s value. Opened so far: ${opened}.`)),
      h('button', { class: 'btn gold', type: 'button', disabled: state.coins < BOX.price, onclick: () => runCase() }, `Open · ₽${BOX.price}`)),
    h('div', { class: 'odds' }, RARITIES.map(r => h('span', { class: 'odd', style: { '--c': r.color } }, h('i'), `${stripStress(r.ru)} ${(r.weight / total * 100).toFixed(1)}%`))));
}

function reelCard(it) {
  const r = rarity(it.rarity);
  return h('div', { class: 'reel-card', style: { '--c': r.color } },
    h('div', { class: 'rc-ico' }, it.kind === 'theme' ? h('div', { class: 'swatch sm', style: { background: `linear-gradient(135deg, ${it.swatch[0]}, ${it.swatch[1]})` } }) : it.emoji || '🏷️'),
    h('div', { class: 'rc-name' }, stripStress(it.name)));
}

function runCase() {
  const res = openBox();
  if (!res.ok) return toast(res.reason, 'red');
  document.querySelector('#top-coins').textContent = state.coins;
  const WIN = 44, N = 52, W = 128; // winning index, card count, card width incl. gap
  const fodder = Array.from({ length: N }, () => BOX_ITEMS[Math.floor(Math.random() * BOX_ITEMS.length)]);
  fodder[WIN] = res.item;
  const reel = h('div', { class: 'reel' }, fodder.map(reelCard));
  const win = h('div', { class: 'reel-window' }, h('div', { class: 'reel-marker' }), reel);
  const result = h('div', { class: 'case-result' });
  const overlay = h('div', { class: 'case-overlay' }, h('div', { class: 'case-inner' }, h('h2', {}, `🪆 ${BOX.name}`), win, result));
  document.body.append(overlay);
  // Start just left of the first card, then land the winner under the marker with a little random offset.
  const windowW = win.clientWidth;
  const offset = (Math.random() - 0.5) * (W * 0.6);
  const target = -(WIN * W + W / 2 - windowW / 2 + offset);
  reel.style.transform = 'translateX(0px)';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    reel.style.transition = 'transform 5.4s cubic-bezier(.08,.72,.1,1)';
    reel.style.transform = `translateX(${target}px)`;
  }));
  // Ticks while passing cards, for the CS:GO feel.
  let ticks = 0; const tick = setInterval(() => { if (++ticks > 40) clearInterval(tick); }, 120);
  reel.addEventListener('transitionend', () => {
    clearInterval(tick);
    const it = res.item, r = rarity(it.rarity);
    reel.querySelectorAll('.reel-card')[WIN].classList.add('won');
    result.replaceChildren(
      h('div', { class: 'won-ico popin' }, it.kind === 'theme' ? h('div', { class: 'swatch', style: { background: `linear-gradient(135deg, ${it.swatch[0]}, ${it.swatch[1]})` } }) : it.emoji || '🏷️'),
      h('div', { class: 'won-rarity', style: { color: r.color } }, `${stripStress(r.ru)} · ${r.en}`),
      h('h1', { lang: 'ru' }, it.name),
      h('div', { class: 'muted' }, `${it.en} · ${it.kind}`),
      h('button', { class: 'audio-btn sm', type: 'button', onclick: () => speak(it.ru || it.name) }, '🔊'),
      res.dup ? h('div', { class: 'pill gold mt' }, `Duplicate · refunded ₽${res.refund}`) : h('div', { class: 'pill green mt' }, 'New! Added to your collection and your review deck'),
      h('div', { class: 'row mt', style: { justifyContent: 'center' } },
        !res.dup && it.kind !== 'boost' ? h('button', { class: 'btn green sm', type: 'button', onclick: () => { equip(it.id); toast('Equipped'); } }, 'Equip') : null,
        h('button', { class: 'btn gold sm', type: 'button', disabled: state.coins < BOX.price, onclick: () => { overlay.remove(); runCase(); } }, `Open another · ₽${BOX.price}`),
        h('button', { class: 'btn secondary sm', type: 'button', onclick: () => { overlay.remove(); navigate('#/shop'); } }, 'Close')));
    speak(it.ru || it.name);
  }, { once: true });
}

function collectionCard() {
  const mine = BOX_ITEMS.filter(i => owned(i.id));
  const byR = RARITIES.map(r => ({ r, items: mine.filter(i => i.rarity === r.id) })).filter(x => x.items.length);
  return h('div', { class: 'card' }, h('h3', {}, `📦 Collection · ${mine.length}/${BOX_ITEMS.length}`),
    mine.length ? null : h('p', { class: 'small' }, 'Items from the mystery box appear here, grouped by rarity.'),
    ...byR.map(({ r, items }) => h('div', { class: 'mt' }, h('div', { class: 'small', style: { color: r.color, fontWeight: 700 } }, `${stripStress(r.ru)} · ${r.en}`),
      h('div', { class: 'shop-grid' }, items.map(card)))));
}

/* ───── Item cards ───── */
function card(it) {
  const own = owned(it.id);
  const eq = state.shop.equipped[it.kind] === it.id;
  const held = it.id === 'b-freeze' ? state.streak.freezes : it.id === 'b-double' ? state.shop.boosts.doubleXP : 0;
  const r = it.rarity ? rarity(it.rarity) : null;
  const visual = it.kind === 'theme'
    ? h('div', { class: 'swatch', style: { background: `linear-gradient(135deg, ${it.swatch[0]}, ${it.swatch[1]})` } })
    : h('div', { class: 'shop-emoji' }, it.emoji || '🏷️');
  const label = it.kind === 'boost' ? `Held: ${held}/${it.max}` : eq ? 'Equipped' : own ? 'Owned' : it.box ? 'Box only' : `₽ ${it.price}`;
  let btn = null;
  if (it.kind === 'boost') btn = h('button', { class: 'btn gold sm', type: 'button', disabled: held >= it.max || state.coins < it.price, onclick: () => act(it) }, `Buy ₽${it.price}`);
  else if (own) btn = h('button', { class: `btn sm ${eq ? 'secondary' : 'green'}`, type: 'button', onclick: () => { equip(it.id); navigate('#/shop'); } }, eq ? 'Unequip' : 'Equip');
  else if (!it.box) btn = h('button', { class: 'btn gold sm', type: 'button', disabled: state.coins < it.price, onclick: () => act(it) }, `Buy ₽${it.price}`);
  return h('div', { class: `shop-item${eq ? ' equipped' : ''}${own ? ' owned' : ''}`, style: r ? { '--c': r.color, borderColor: r.color } : null, onclick: e => { if (e.target.tagName !== 'BUTTON' && it.ru) speak(it.ru); } },
    visual,
    h('b', { lang: 'ru' }, it.name), h('span', { class: 'small muted' }, it.en + (it.desc ? ` · ${it.desc}` : '')),
    r ? h('span', { class: 'small', style: { color: r.color, fontWeight: 700 } }, stripStress(r.ru)) : null,
    h('span', { class: 'pill' }, label), btn);
}
function act(it) {
  const r = buy(it.id);
  if (r.ok) toast(`Bought ${stripStress(it.name)}! Added to your deck.`, 'gold'); else toast(r.reason, 'red');
  navigate('#/shop');
}
export { byId };
