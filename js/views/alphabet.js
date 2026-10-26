// Alphabet reference: all 33 letters, tap to hear and read about each.
import { h } from '../util.js';
import { state } from '../state.js';
import { LETTERS, GROUPS, WORDS_BY_GROUP, translit } from '../../data/alphabet.js';
import { mastery } from '../srs.js';
import { letterId } from '../content.js';
import { speak } from '../audio.js';
import { audioBtn } from '../exercises.js';

export function render() {
  const el = h('div');
  el.append(h('h1', {}, 'The alphabet · Алфавит'), h('p', {}, '33 letters: 10 vowels, 21 consonants and 2 signs. Tap a letter to hear its name and see example words. The dot shows how well you know it.'));
  const detail = h('div', { class: 'alpha-detail' });
  let active = null;
  const grid = h('div', { class: 'alpha-grid' }, LETTERS.map(l => {
    const m = mastery(state.srs[letterId(l.up)]);
    const known = !!state.srs[letterId(l.up)];
    const b = h('button', { class: 'alpha', type: 'button', lang: 'ru', onclick: () => { speak(l.name); show(l); grid.querySelectorAll('.alpha').forEach(x => x.classList.remove('active')); b.classList.add('active'); } },
      h('div', { class: `dot ${known ? m : ''}` }), h('div', { class: 'glyph' }, `${l.up} ${l.low}`), h('div', { class: 's' }, l.sound));
    return b;
  }));
  el.append(grid, detail);
  el.append(h('div', { class: 'card soft mt' }, h('h3', {}, 'Legend'), h('div', { class: 'row small' },
    h('span', { class: 'pill' }, '○ not started'), h('span', { class: 'pill gold' }, '● learning'), h('span', { class: 'pill blue' }, '● known'), h('span', { class: 'pill green' }, '● mastered'))));

  function show(l) {
    active = l;
    const group = GROUPS.find(g => g.id === l.group);
    const examples = (WORDS_BY_GROUP[l.group] || []).filter(w => w.ru.toLowerCase().includes(l.low)).slice(0, 4);
    if (!examples.some(w => w.ru === l.ex)) examples.unshift({ ru: l.ex, en: '' });
    detail.replaceChildren(h('div', { class: 'card popin' },
      h('div', { class: 'spread' },
        h('div', {}, h('div', { style: { fontSize: '3rem', fontWeight: 800 }, lang: 'ru' }, `${l.up} ${l.low}`), h('div', { class: 'muted' }, `name: ${l.name} · sound: ${l.sound}`)),
        audioBtn(l.name, { cls: 'sm' })),
      h('p', { class: 'mt' }, l.tip),
      h('div', { class: 'pill accent' }, `${group.icon} ${group.title}`),
      h('h3', { class: 'mt' }, 'Example words'),
      h('div', { class: 'list' }, examples.map(w => h('div', { class: 'item' }, audioBtn(w.ru, { cls: 'inline' }), h('div', { class: 'body' }, h('b', { lang: 'ru' }, w.ru), h('span', {}, [translit(w.ru), w.en].filter(Boolean).join(' · '))))))));
  }
  return el;
}
