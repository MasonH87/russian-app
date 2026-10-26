// Full-screen session runner shared by lessons, tests and reviews.
import { h, pick, stripStress } from './util.js';
import { renderExercise, isCyrillic, audioBtn } from './exercises.js';
import { speak, stopSpeaking } from './audio.js';

const PRAISE = [['Отлично!', 'Excellent!'], ['Молодец!', 'Well done!'], ['Правильно!', 'Correct!'], ['Супер!', 'Super!'], ['Так держать!', 'Keep it up!'], ['Верно!', 'Right!'], ['Здорово!', 'Great!']];

export function letterCard(l) {
  return h('div', { class: 'letter-card' },
    audioBtn(l.name, { cls: 'inline' }),
    h('div', { class: 'glyph', lang: 'ru' }, `${l.up} ${l.low}`),
    h('div', { class: 'lname' }, `name: ${l.name}`),
    h('div', { class: 'lsound' }, l.sound),
    h('div', { class: 'ltip' }, l.tip));
}

export function renderSlide(slide) {
  const el = h('div', { class: 'lecture' });
  if (slide.title) el.append(h('h2', {}, slide.title));
  if (slide.html) {
    const box = h('div', { html: slide.html });
    box.querySelectorAll('[data-say]').forEach(x => { x.classList.add('say'); x.onclick = () => speak(x.dataset.say || x.textContent); });
    el.append(box);
  }
  if (slide.letters) el.append(h('div', { class: 'letter-grid' }, slide.letters.map(letterCard)));
  if (slide.words) el.append(h('div', { class: 'list' }, slide.words.map(w =>
    h('div', { class: 'item' }, audioBtn(w.ru, { cls: 'inline' }),
      h('div', { class: 'body' }, h('b', { lang: 'ru' }, w.ru), h('span', {}, [w.translit, w.en].filter(Boolean).join(' · ')))))));
  if (slide.footer) el.append(h('div', { class: 'callout', html: slide.footer }));
  return el;
}

/**
 * runSession({ lecture, exercises, requeue, xpPerCorrect, onAnswer(ex, result, firstTry), onFinish(stats, close) -> Element, onQuit })
 */
export function runSession(opts) {
  const { lecture = [], exercises, onAnswer, onFinish, onQuit, requeue = true, xpPerCorrect = 10 } = opts;
  const queue = exercises.map(e => ({ ...e }));
  let step = 0, total = lecture.length + queue.length, xp = 0, phase = 'idle', current = null;
  const answers = [];

  const bar = h('i', { style: { width: '0%' } });
  const xpEl = h('div', { class: 'sxp' }, '0 XP');
  const body = h('div', { class: 'session-inner' });
  const bodyWrap = h('div', { class: 'session-body' }, body);
  const footInner = h('div', { class: 'inner' });
  const foot = h('div', { class: 'session-foot' }, footInner);
  const root = h('div', { class: 'session', role: 'dialog' },
    h('div', { class: 'session-head' }, h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Quit', onclick: quit }, '✕'), h('div', { class: 'progress' }, bar), xpEl),
    bodyWrap, foot);
  document.body.append(root);
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onKey);

  function close() { stopSpeaking(); root.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); }
  function quit() {
    if (phase === 'results') return close();
    if (confirm('Quit this session? Progress inside it will be lost.')) { close(); onQuit && onQuit(); }
  }
  function setProgress() { bar.style.width = Math.min(100, Math.round(step / total * 100)) + '%'; bodyWrap.scrollTop = 0; }
  function advance() { step++; next(); }
  function next() {
    if (step < lecture.length) return showLecture(lecture[step]);
    const i = step - lecture.length;
    if (i < queue.length) return showExercise(queue[i]);
    finish();
  }
  function showLecture(slide) {
    phase = 'lecture';
    body.replaceChildren(renderSlide(slide));
    foot.className = 'session-foot';
    footInner.replaceChildren(h('button', { class: 'btn block', type: 'button', onclick: advance }, 'Continue'));
    setProgress();
  }
  function showExercise(ex) {
    phase = 'answer';
    const checkBtn = h('button', { class: 'btn block', type: 'button', disabled: true, onclick: () => doCheck() }, 'Check');
    const ctx = {
      onReady(ok) { checkBtn.disabled = !ok; },
      onAuto(result) { grade(result); },
      submit() { if (!checkBtn.disabled && phase === 'answer') doCheck(); },
    };
    current = renderExercise(ex, ctx);
    body.replaceChildren(current.el);
    foot.className = 'session-foot';
    if (current.autoGrade) footInner.replaceChildren(h('div', { class: 'muted center small' }, ex.type === 'match' ? 'Match all the pairs to continue.' : 'Tap the microphone, then say the phrase.'));
    else footInner.replaceChildren(checkBtn);
    setProgress();
    function doCheck() { const r = current.check(); if (r) grade(r); }
    function grade(result) {
      if (phase !== 'answer') return;
      phase = 'feedback';
      const firstTry = !ex._requeued;
      answers.push({ ex, correct: result.correct, firstTry, typo: !!result.typo });
      if (result.correct) xp += firstTry ? xpPerCorrect : Math.ceil(xpPerCorrect / 2);
      xpEl.textContent = xp + ' XP';
      onAnswer && onAnswer(ex, result, firstTry);
      if (!result.correct && requeue && result.requeue !== false && !ex._requeued && !result.skipped) { queue.push({ ...ex, _requeued: true }); total++; }
      showFeedback(result, ex);
    }
  }
  function showFeedback(result, ex) {
    const expected = result.expected ?? ex.answer ?? '';
    foot.className = 'session-foot ' + (result.correct ? 'ok' : 'bad');
    const fb = h('div', { class: 'fb ' + (result.correct ? 'ok' : 'bad') });
    if (result.correct) {
      const [ru, en] = pick(PRAISE);
      fb.append(h('div', { class: 'fb-ico' }, '✅'), h('div', {},
        h('b', {}, result.typo ? 'Correct, but check the spelling' : `${ru} ${en}`),
        result.typo ? h('span', { class: 'fb-ru', lang: 'ru' }, expected) : null,
        (result.explain || ex.explain) ? h('span', {}, result.explain || ex.explain) : null));
    } else {
      fb.append(h('div', { class: 'fb-ico' }, result.skipped ? '⏭️' : '❌'), h('div', {},
        h('b', {}, result.skipped ? 'Skipped. The answer was:' : expected ? 'Correct answer:' : 'Not quite'),
        expected ? h('span', { class: 'fb-ru', lang: isCyrillic(expected) ? 'ru' : 'en' }, expected) : null,
        (result.explain || ex.explain) ? h('span', {}, result.explain || ex.explain) : null));
      if (isCyrillic(expected)) speak(expected);
    }
    footInner.replaceChildren(fb, h('button', { class: `btn block ${result.correct ? 'green' : 'red'}`, type: 'button', onclick: advance }, 'Continue'));
  }
  function finish() {
    phase = 'results';
    const firstTries = answers.filter(a => a.firstTry);
    const correct = firstTries.filter(a => a.correct).length;
    const stats = { total: firstTries.length, correct, accuracy: firstTries.length ? Math.round(correct / firstTries.length * 100) : 100, xp, answers };
    bar.style.width = '100%';
    foot.hidden = true;
    body.replaceChildren(onFinish(stats, close));
    bodyWrap.scrollTop = 0;
  }
  function onKey(e) {
    if (e.key !== 'Enter') return;
    if (phase === 'feedback' || phase === 'lecture') { e.preventDefault(); advance(); }
    else if (phase === 'answer' && document.activeElement?.tagName !== 'INPUT') { const b = footInner.querySelector('button.btn'); if (b && !b.disabled) b.click(); }
  }
  next();
  return { close };
}
