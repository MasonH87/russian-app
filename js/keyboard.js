// On-screen Cyrillic keyboard (ЙЦУКЕН layout) for typing exercises.
import { h } from './util.js';

const ROWS = ['йцукенгшщзхъ', 'фывапролджэ', 'ячсмитьбюё'];
const isTouch = matchMedia('(pointer: coarse)').matches;

export function createKeyboard(input, onInput) {
  const fire = () => onInput && onInput();
  const focus = () => { try { input.focus({ preventScroll: true }); } catch { input.focus(); } };
  if (isTouch) input.setAttribute('inputmode', 'none'); // keep the native keyboard away while ours is shown

  const insert = ch => {
    const s = input.selectionStart ?? input.value.length, e = input.selectionEnd ?? s;
    input.value = input.value.slice(0, s) + ch + input.value.slice(e);
    const pos = s + ch.length;
    focus(); input.setSelectionRange(pos, pos); fire();
  };
  const backspace = () => {
    const s = input.selectionStart ?? input.value.length, e = input.selectionEnd ?? s;
    if (s !== e) input.value = input.value.slice(0, s) + input.value.slice(e);
    else if (s > 0) input.value = input.value.slice(0, s - 1) + input.value.slice(s);
    const pos = s !== e ? s : Math.max(0, s - 1);
    focus(); input.setSelectionRange(pos, pos); fire();
  };
  const key = (label, fn, cls = '') => h('button', { class: `key ${cls}`, type: 'button', onmousedown: e => e.preventDefault(), onclick: fn }, label);

  const kbd = h('div', { class: 'kbd', 'aria-label': 'Russian keyboard' });
  ROWS.forEach((row, i) => {
    const r = h('div', { class: 'kbd-row' }, [...row].map(ch => key(ch, () => insert(ch))));
    if (i === ROWS.length - 1) r.append(key('⌫', backspace, 'fn'));
    kbd.append(r);
  });
  kbd.append(h('div', { class: 'kbd-row' },
    key('-', () => insert('-'), 'fn'),
    key('space', () => insert(' '), 'wide fn'),
    key('?', () => insert('?'), 'fn'),
    key('!', () => insert('!'), 'fn'),
  ));

  const toggle = h('div', { class: 'kbd-toggle' },
    h('button', { class: 'btn ghost sm', type: 'button', onclick: () => {
      const hidden = kbd.hidden = !kbd.hidden;
      toggle.firstChild.textContent = hidden ? 'Show on-screen keyboard' : 'Use my own keyboard';
      if (isTouch) { if (hidden) input.removeAttribute('inputmode'); else input.setAttribute('inputmode', 'none'); }
      focus();
    } }, 'Use my own keyboard'));
  return h('div', {}, kbd, toggle);
}
