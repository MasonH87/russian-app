// Phrases tab: everyday Russian and slang, plus a gated 18+ section for мат and gaming trash talk.
import { h, navigate, toast, stripStress } from '../util.js';
import { state, save } from '../state.js';
import { PHRASE_GROUPS, MAT_GROUPS, phraseOfTheDay } from '../../data/phrases.js';
import { wordId } from '../content.js';
import { addItem } from '../srs.js';
import { speak } from '../audio.js';
import { audioBtn } from '../exercises.js';

export function render(arg) {
  const mat = arg === 'mat';
  const el = h('div');
  el.append(h('h1', {}, mat ? 'Мат and trash talk · 18+' : 'Phrases · Фразы'));
  el.append(h('div', { class: 'ptabs' },
    h('a', { href: '#/phrases', class: mat ? '' : 'active' }, '💬 Everyday'),
    h('a', { href: '#/phrases/mat', class: 'mat' + (mat ? ' active' : '') }, '🔞 Мат')));
  if (!mat) {
    const pod = phraseOfTheDay();
    el.append(h('div', { class: 'card accent pod' }, h('div', { class: 'small', style: { opacity: .8 } }, 'Phrase of the day'),
      h('div', { class: 'row', style: { flexWrap: 'nowrap', alignItems: 'flex-start' } }, audioBtn(pod.ru, { cls: 'sm' }), h('div', {}, h('div', { class: 'big', lang: 'ru' }, pod.ru), h('div', {}, pod.en), pod.lit ? h('div', { class: 'small', style: { opacity: .8 } }, `literally: ${pod.lit}`) : null))));
    el.append(h('p', { class: 'small' }, 'What Russians actually say, with the register you need to use it right. Tap 🔊 to hear it and + to add it to your review deck. A new one lands on your Home screen every day.'));
    PHRASE_GROUPS.forEach(g => el.append(group(g)));
  } else if (!state.settings.matUnlocked) {
    el.append(h('div', { class: 'card', style: { borderColor: 'var(--red)' } },
      h('h2', {}, '🔞 Strong language ahead'),
      h('p', {}, 'This section contains мат, the hard profanity of Russian, with blunt English translations, plus the insults and callouts you will hear in Counter-Strike voice chat. It is here so you understand what is being shouted at you and can shout back.'),
      h('ul', { class: 'small', style: { color: 'var(--text-2)', lineHeight: 1.6 } },
        h('li', {}, 'Мат is far stronger than English swearing in polite company. It is fined on TV and radio in Russia.'),
        h('li', {}, 'Never in front of her parents, older relatives, teachers, shop staff or officials. Even many friends dislike it.'),
        h('li', {}, 'Among gamers and close male friends it is constant. Read the room.'),
        h('li', {}, 'Levels: ⚠️ rude · ⚠️⚠️ strong · 🔞 мат.')),
      h('button', { class: 'btn red', type: 'button', onclick: () => { state.settings.matUnlocked = true; save(); navigate('#/phrases/mat'); } }, 'I am an adult, show me')));
  } else {
    el.append(h('div', { class: 'card soft', style: { borderColor: 'var(--red)' } }, h('p', { class: 'small', style: { margin: 0 } }, '🔞 Mат (level 🔞) is never acceptable with her family or strangers. Level ⚠️ words are everyday rude. Words you add to your deck are reviewed like any other.'),
      h('button', { class: 'btn ghost sm', type: 'button', onclick: () => { state.settings.matUnlocked = false; save(); navigate('#/phrases/mat'); } }, 'Hide this section again')));
    MAT_GROUPS.forEach(g => el.append(group(g, true)));
  }
  return el;
}

function group(g, mat = false) {
  return h('div', { class: 'card' }, h('h3', {}, `${g.icon} ${g.title}`), h('div', {}, g.items.map(it => phrase(it, mat))));
}

function phrase(it, mat) {
  const id = wordId(it.ru);
  const inDeck = !!state.srs[id];
  const add = h('button', { class: `add${inDeck ? ' on' : ''}`, type: 'button', title: inDeck ? 'In your deck' : 'Add to review deck', onclick: () => {
    if (state.srs[id]) return toast('Already in your deck');
    addItem(id); save(); add.classList.add('on'); add.textContent = '✓'; toast(`Added «${stripStress(it.ru)}» to your deck`, 'green');
  } }, inDeck ? '✓' : '+');
  const lvl = mat && it.level ? h('span', { class: `lvl lvl-${it.level}` }, it.level === 3 ? '🔞 мат' : it.level === 2 ? '⚠️⚠️ strong' : '⚠️ rude') : null;
  return h('div', { class: 'phrase' },
    audioBtn(it.ru, { cls: 'inline' }),
    h('div', { class: 'body', onclick: () => speak(it.ru) },
      h('span', { class: 'ru', lang: 'ru' }, it.ru, lvl),
      h('span', { class: 'en' }, it.en),
      (it.lit || it.note) ? h('span', { class: 'note' }, [it.lit ? `lit. ${it.lit}` : null, it.note].filter(Boolean).join(' · ')) : null),
    add);
}
