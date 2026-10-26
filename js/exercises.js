// Exercise renderers. Each returns { el, check() -> {correct, typo, expected} , autoGrade }.
// ctx = { onReady(bool), onAuto(result), submit() }
import { h, shuffle, matchAnswer, norm, stripStress, lev } from './util.js';
import { speak, canListen, listen } from './audio.js';
import { createKeyboard } from './keyboard.js';
import { state } from './state.js';

export const isCyrillic = s => /[Ѐ-ӿ]/.test(s || '');

export function audioBtn(text, { cls = '', slow = false } = {}) {
  return h('button', {
    class: `audio-btn ${cls}`, type: 'button', 'aria-label': slow ? 'Play slowly' : 'Play audio',
    onclick: e => { e.stopPropagation(); speak(text, { slow }); },
  }, slow ? '🐢' : '🔊');
}
const kindEl = label => h('div', { class: 'ex-kind' }, label);
function promptEl(ex) {
  const p = h('div', { class: 'ex-prompt' }, ex.prompt || '');
  if (ex.big) p.append(h('span', { class: 'big', lang: 'ru' }, ex.big));
  if (ex.hint) p.append(h('span', { class: 'hint' }, ex.hint));
  return p;
}
function audioRow(text, autoplay = true) {
  const row = h('div', { class: 'audio-row' }, audioBtn(text), audioBtn(text, { cls: 'sm', slow: true }));
  if (autoplay && state.settings.autoplay) setTimeout(() => speak(text), 350);
  return row;
}
function textInput(ctx, { cyrillic = true, placeholder = '' } = {}) {
  const input = h('input', { class: 'text-input', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder, lang: cyrillic ? 'ru' : 'en' });
  input.addEventListener('input', () => ctx.onReady(input.value.trim().length > 0));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } });
  const wrap = h('div', {}, input);
  if (cyrillic && state.settings.keyboard) wrap.append(createKeyboard(input, () => ctx.onReady(input.value.trim().length > 0)));
  setTimeout(() => { try { input.focus({ preventScroll: true }); } catch { /* noop */ } }, 50);
  return { wrap, input };
}

/* ── Multiple choice ── */
function mc(ex, ctx) {
  let sel = null, locked = false;
  const el = h('div', { class: 'ex' }, kindEl(ex.kindLabel || 'Choose the right answer'), promptEl(ex));
  if (ex.audio) el.append(audioRow(ex.audio));
  const opts = ex.noShuffle ? ex.options : shuffle(ex.options);
  const btns = opts.map(o => h('button', {
    class: 'opt' + (ex.bigOptions ? ' big' : ''), type: 'button', lang: isCyrillic(o) ? 'ru' : 'en',
    onclick: () => {
      if (locked) return;
      btns.forEach(b => b.classList.remove('selected'));
      const b = btns[opts.indexOf(o)]; b.classList.add('selected'); sel = o; ctx.onReady(true);
      if (ex.speakOptions && isCyrillic(o)) speak(o);
    },
  }, o));
  el.append(h('div', { class: 'options' + (opts.length <= 2 ? ' cols-1' : '') }, btns));
  return {
    el,
    check() {
      locked = true;
      const correct = norm(sel) === norm(ex.answer);
      btns.forEach((b, i) => {
        b.disabled = true;
        if (norm(opts[i]) === norm(ex.answer)) b.classList.add('correct');
        else if (opts[i] === sel) b.classList.add('wrong');
      });
      if (correct && ex.speakAfter) speak(ex.speakAfter);
      return { correct, expected: ex.answer };
    },
  };
}

/* ── Match pairs ── */
function match(ex, ctx) {
  const pairs = ex.pairs.slice(0, 6);
  let left = null, right = null, matched = 0, mistakes = 0;
  const el = h('div', { class: 'ex' }, kindEl('Match the pairs'), promptEl({ prompt: ex.prompt || 'Tap a card on the left, then its match on the right.' }));
  const lcol = h('div', { class: 'match-col' }), rcol = h('div', { class: 'match-col' });
  const mk = (text, side, idx) => {
    const b = h('button', { class: 'mi' + (isCyrillic(text) ? ' ru' : ''), type: 'button', lang: isCyrillic(text) ? 'ru' : 'en' }, text);
    b._idx = idx;
    b.addEventListener('click', () => choose(side, idx, b));
    return b;
  };
  const lbtns = shuffle(pairs.map((p, i) => i)).map(i => mk(pairs[i][0], 'l', i));
  const rbtns = shuffle(pairs.map((p, i) => i)).map(i => mk(pairs[i][1], 'r', i));
  lcol.append(...lbtns); rcol.append(...rbtns);
  el.append(h('div', { class: 'match-grid' }, lcol, rcol));
  function choose(side, idx, b) {
    if (side === 'l') { if (isCyrillic(b.textContent) && ex.speakLeft !== false) speak(b.textContent); lbtns.forEach(x => x.classList.remove('selected')); b.classList.add('selected'); left = b; }
    else { rbtns.forEach(x => x.classList.remove('selected')); b.classList.add('selected'); right = b; }
    if (left && right) {
      const ok = left._idx === right._idx;
      const L = left, R = right; left = right = null;
      if (ok) {
        L.classList.remove('selected'); R.classList.remove('selected'); L.classList.add('matched'); R.classList.add('matched'); matched++;
        if (matched === pairs.length) setTimeout(() => ctx.onAuto({ correct: mistakes <= 1, requeue: false, expected: null, mistakes, explain: mistakes ? `${mistakes} slip${mistakes > 1 ? 's' : ''} along the way, but all matched.` : '' }), 350);
      } else {
        mistakes++;
        L.classList.add('wrong'); R.classList.add('wrong'); L.classList.add('shake'); R.classList.add('shake');
        setTimeout(() => { [L, R].forEach(x => x.classList.remove('wrong', 'selected', 'shake')); }, 500);
      }
    }
  }
  return { el, autoGrade: true, check() { return null; } };
}

/* ── Listen and type ── */
function listenType(ex, ctx) {
  const el = h('div', { class: 'ex' }, kindEl('Type what you hear'), promptEl({ prompt: ex.prompt || 'Listen, then type it in Russian.', hint: ex.hint }));
  el.append(audioRow(ex.audio));
  const { wrap, input } = textInput(ctx, { cyrillic: true, placeholder: 'Type in Russian…' });
  el.append(wrap);
  return {
    el,
    check() {
      const r = matchAnswer(input.value, ex.answer, ex.accept);
      input.disabled = true;
      return { ...r, expected: ex.answer };
    },
  };
}

/* ── Word tiles ── */
function tiles(ex, ctx) {
  const answerWords = stripStress(ex.answer).split(/\s+/);
  let bank = ex.tiles ? [...ex.tiles] : [];
  for (const w of answerWords) if (!bank.some(t => norm(t) === norm(w))) bank.push(w);
  bank = shuffle(bank);
  const chosen = [];
  const el = h('div', { class: 'ex' }, kindEl('Build the sentence'), promptEl({ prompt: ex.prompt }));
  if (ex.audio) el.append(audioRow(ex.audio, false));
  const ans = h('div', { class: 'tiles-answer' });
  const bankEl = h('div', { class: 'tiles-bank' });
  el.append(ans, bankEl);
  const render = () => {
    ans.replaceChildren(...chosen.map((t, i) => h('button', { class: 'tile', type: 'button', lang: 'ru', onclick: () => { chosen.splice(i, 1); render(); } }, t.text)));
    bankEl.replaceChildren(...bank.map((text, i) => {
      const used = chosen.some(c => c.i === i);
      return h('button', { class: 'tile' + (used ? ' ghost' : ''), type: 'button', lang: 'ru', disabled: used, onclick: () => { chosen.push({ text, i }); if (ex.speakTiles !== false) speak(text); render(); } }, text);
    }));
    ctx.onReady(chosen.length > 0);
  };
  render();
  return {
    el,
    check() {
      const user = chosen.map(c => c.text).join(' ');
      const r = matchAnswer(user, ex.answer, ex.accept);
      r.typo = false;
      if (r.correct) speak(ex.answer);
      return { ...r, expected: ex.answer };
    },
  };
}

/* ── Fill in the blank ── */
function fill(ex, ctx) {
  let sel = null, locked = false;
  const parts = ex.sentence.split('___');
  const blank = h('span', { class: 'blank' }, ' ');
  const sent = h('div', { class: 'fill-sentence', lang: 'ru' }, parts[0], blank, parts[1] ?? '');
  const el = h('div', { class: 'ex' }, kindEl('Fill in the blank'), promptEl({ prompt: ex.prompt || 'Complete the sentence.' }), sent);
  if (ex.translation) el.append(h('div', { class: 'fill-trans' }, ex.translation));
  const opts = shuffle(ex.options);
  const btns = opts.map(o => h('button', { class: 'opt', type: 'button', lang: 'ru', onclick: () => {
    if (locked) return; btns.forEach(b => b.classList.remove('selected'));
    btns[opts.indexOf(o)].classList.add('selected'); sel = o; blank.textContent = o; ctx.onReady(true);
  } }, o));
  el.append(h('div', { class: 'options' }, btns));
  return {
    el,
    check() {
      locked = true;
      const correct = norm(sel) === norm(ex.answer);
      btns.forEach((b, i) => { b.disabled = true; if (norm(opts[i]) === norm(ex.answer)) b.classList.add('correct'); else if (opts[i] === sel) b.classList.add('wrong'); });
      blank.textContent = ex.answer; blank.style.color = correct ? 'var(--green)' : 'var(--red)';
      if (correct) speak(ex.sentence.replace('___', ex.answer));
      return { correct, expected: ex.sentence.replace('___', ex.answer) };
    },
  };
}

/* ── Translate (typed) ── */
function translate(ex, ctx) {
  const toRu = ex.dir !== 'ru-en';
  const el = h('div', { class: 'ex' }, kindEl(toRu ? 'Translate into Russian' : 'Translate into English'));
  if (toRu) el.append(promptEl({ prompt: ex.prompt, hint: ex.hint }));
  else { el.append(promptEl({ prompt: 'What does this mean?', big: ex.prompt, hint: ex.hint })); el.append(audioRow(ex.prompt)); }
  const { wrap, input } = textInput(ctx, { cyrillic: toRu, placeholder: toRu ? 'Type in Russian…' : 'Type in English…' });
  el.append(wrap);
  return {
    el,
    check() {
      const r = matchAnswer(input.value, ex.answer, ex.accept);
      input.disabled = true;
      if (r.correct && toRu) speak(ex.answer);
      return { ...r, expected: ex.answer };
    },
  };
}

/* ── Speak ── */
function speakEx(ex, ctx) {
  let attempts = 0;
  const heard = h('div', { class: 'heard' });
  const mic = h('button', { class: 'mic-btn', type: 'button', 'aria-label': 'Record' }, '🎤');
  const el = h('div', { class: 'ex' }, kindEl('Say it out loud'),
    h('div', { class: 'speak-card' },
      audioBtn(ex.text, { cls: 'sm' }),
      h('div', { class: 'speak-text', lang: 'ru' }, ex.text),
      h('div', { class: 'muted' }, ex.en || ''),
      canListen() ? mic : null,
      heard,
    ));
  const actions = h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '10px' } });
  el.append(actions);
  const selfGrade = () => {
    actions.replaceChildren(
      h('button', { class: 'btn green sm', type: 'button', onclick: () => ctx.onAuto({ correct: true, expected: ex.text, explain: 'Self-graded. Ask your partner to check your pronunciation!' }) }, 'I said it ✓'),
      h('button', { class: 'btn ghost sm', type: 'button', onclick: () => ctx.onAuto({ correct: false, expected: ex.text, skipped: true }) }, 'Skip'),
    );
  };
  if (state.settings.autoplay) setTimeout(() => speak(ex.text), 350);
  if (!canListen()) { heard.textContent = 'Speech recognition is not available in this browser, so grade yourself honestly.'; selfGrade(); }
  else {
    actions.replaceChildren(h('button', { class: 'btn ghost sm', type: 'button', onclick: () => ctx.onAuto({ correct: false, expected: ex.text, skipped: true }) }, "Can't speak right now"));
    mic.onclick = async () => {
      mic.classList.add('listening'); heard.textContent = 'Listening…';
      try {
        const alts = await listen();
        mic.classList.remove('listening');
        const target = norm(ex.text);
        const best = alts.map(a => ({ a, d: lev(norm(a), target) })).sort((x, y) => x.d - y.d)[0];
        heard.textContent = `Heard: “${best.a}”`;
        const ok = best.d <= Math.max(1, Math.floor(target.length * 0.35));
        attempts++;
        if (ok) ctx.onAuto({ correct: true, expected: ex.text, heard: best.a });
        else if (attempts >= 3) ctx.onAuto({ correct: false, expected: ex.text, heard: best.a, explain: 'The recogniser could not match it after 3 tries. Keep practising this one with your partner.' });
        else heard.textContent += ' — try again, a little slower.';
      } catch (err) {
        mic.classList.remove('listening');
        heard.textContent = err.message === 'not-allowed' ? 'Microphone access was blocked. Allow it in your browser, or grade yourself.' : 'Did not catch that. Tap the mic and try again, or grade yourself.';
        selfGrade();
      }
    };
  }
  return { el, autoGrade: true, check() { return null; } };
}

const RENDERERS = { mc, match, listen_type: listenType, tiles, fill, translate, speak: speakEx };

export function renderExercise(ex, ctx) {
  const fn = RENDERERS[ex.type];
  if (!fn) throw new Error('Unknown exercise type: ' + ex.type);
  return fn(ex, ctx);
}
