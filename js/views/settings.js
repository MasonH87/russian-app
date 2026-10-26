// Settings: profile, goal, audio, theme, backup.
import { h, toast, navigate } from '../util.js';
import { state, save, exportJSON, importJSON, resetAll } from '../state.js';
import { russianVoices, speak, ttsSupported, canListen } from '../audio.js';

function toggle(label, desc, get, set) {
  const sw = h('div', { class: `switch${get() ? ' on' : ''}`, role: 'switch', 'aria-checked': String(get()) });
  return h('div', { class: 'toggle', onclick: () => { set(!get()); save(); sw.classList.toggle('on', get()); sw.setAttribute('aria-checked', String(get())); } },
    h('div', {}, h('b', {}, label), desc ? h('div', { class: 'small muted' }, desc) : null), sw);
}

function diagnostics() {
  const all = ttsSupported() ? speechSynthesis.getVoices() : [];
  const ru = russianVoices();
  const out = h('div', { class: 'small muted', style: { marginTop: '6px' } });
  const line = (ok, text) => h('div', {}, `${ok ? '✅' : '⚠️'} ${text}`);
  const box = h('div', { class: 'card soft', style: { marginTop: '12px', padding: '12px' } },
    h('b', {}, 'Audio diagnostics'),
    line(ttsSupported(), ttsSupported() ? `Text-to-speech available · ${all.length} voices installed` : 'No text-to-speech in this browser'),
    line(ru.length > 0, ru.length ? `Russian voices: ${ru.map(v => v.name).join(', ')}` : 'No Russian voice installed. Windows: Settings → Time & Language → Speech → Manage voices → Add voices → Русский, then restart the browser.'),
    line(navigator.onLine, navigator.onLine ? `Online · ${ru.length ? 'local voice will be used' : 'online fallback voice will be used'}` : 'Offline'),
    h('div', { class: 'row', style: { marginTop: '8px' } },
      h('button', { class: 'btn secondary sm', type: 'button', onclick: async () => {
        out.textContent = 'Playing “Привет, как дела?”…';
        const t0 = Date.now(); await speak('Привет, как дела?');
        out.textContent = `Finished after ${((Date.now() - t0) / 1000).toFixed(1)}s. If you heard nothing: check the system volume and that this tab is not muted. If it sounded English, no Russian voice is installed.`;
      } }, '▶ Play test'),
      h('button', { class: 'btn ghost sm', type: 'button', onclick: () => navigate('#/settings') }, 'Re-scan voices')),
    out);
  return box;
}

export function render() {
  const s = state.settings;
  const el = h('div');
  el.append(h('h1', {}, 'Settings'));

  const name = h('input', { class: 'text', type: 'text', value: s.name || '', placeholder: 'Your name' });
  name.addEventListener('change', () => { s.name = name.value.trim(); save(); toast('Saved'); });
  const goal = h('select', { class: 'text' }, [30, 50, 100, 150].map(g => h('option', { value: g, selected: state.dailyGoal === g }, `${g} XP · ${g <= 30 ? 'casual (10 min)' : g <= 50 ? 'regular (20–30 min)' : g <= 100 ? 'serious (45 min)' : 'intense'}`)));
  goal.addEventListener('change', () => { state.dailyGoal = Number(goal.value); save(); toast('Daily goal updated'); });
  el.append(h('div', { class: 'card' }, h('h3', {}, 'Profile'),
    h('div', { class: 'field' }, h('label', {}, 'Name'), name),
    h('div', { class: 'field' }, h('label', {}, 'Daily goal'), goal),
    toggle('Light theme', 'Dark is the default.', () => s.theme === 'light', v => { s.theme = v ? 'light' : 'dark'; document.documentElement.dataset.theme = s.theme; })));

  const voices = russianVoices();
  const voiceSel = h('select', { class: 'text' }, h('option', { value: '' }, voices.length ? 'Automatic (best available)' : 'No Russian voice installed'), voices.map(v => h('option', { value: v.name, selected: s.voice === v.name }, `${v.name}${v.localService ? '' : ' (online)'}`)));
  voiceSel.addEventListener('change', () => { s.voice = voiceSel.value; save(); speak('Привет! Как дела?'); });
  el.append(h('div', { class: 'card' }, h('h3', {}, 'Audio and speech'),
    h('div', { class: 'field' }, h('label', {}, 'Russian voice'), voiceSel, h('div', { class: 'row' }, h('button', { class: 'btn secondary sm', type: 'button', onclick: () => speak('Здравствуйте! Меня зовут Мейсон. Очень приятно.') }, '🔊 Test voice'), h('button', { class: 'btn ghost sm', type: 'button', onclick: () => navigate('#/settings') }, 'Refresh voice list'))),
    !ttsSupported() ? h('p', { class: 'small' }, 'This browser has no text-to-speech.') : null,
    diagnostics(),
    toggle('Auto-play audio', 'Play the Russian automatically when an exercise appears.', () => s.autoplay, v => s.autoplay = v),
    toggle('Slower speech', 'Speak at 80% speed everywhere (the 🐢 button is always slower still).', () => s.slowAudio, v => s.slowAudio = v),
    toggle('Speaking exercises', canListen() ? 'Uses your microphone and the browser’s speech recognition.' : 'Speech recognition is unavailable here, so these are self-graded.', () => s.speakExercises, v => s.speakExercises = v),
    toggle('On-screen Russian keyboard', 'Turn off once you have a Russian keyboard set up on your device.', () => s.keyboard, v => s.keyboard = v)));

  const file = h('input', { type: 'file', accept: 'application/json', hidden: true });
  file.addEventListener('change', async () => {
    const f = file.files[0]; if (!f) return;
    try { importJSON(await f.text()); toast('Progress imported', 'green'); setTimeout(() => location.reload(), 500); }
    catch (e) { toast('Import failed: ' + e.message, 'red'); }
  });
  el.append(h('div', { class: 'card' }, h('h3', {}, 'Backup'),
    h('p', { class: 'small' }, 'Progress is stored in this browser only. Export a file to move it to your phone or another computer, or just to be safe.'),
    h('div', { class: 'row' },
      h('button', { class: 'btn secondary', type: 'button', onclick: () => {
        const blob = new Blob([exportJSON()], { type: 'application/json' });
        const a = h('a', { href: URL.createObjectURL(blob), download: `russkiy-progress-${new Date().toISOString().slice(0, 10)}.json` });
        document.body.append(a); a.click(); a.remove();
      } }, '⬇️ Export progress'),
      h('button', { class: 'btn secondary', type: 'button', onclick: () => file.click() }, '⬆️ Import progress'), file)));

  el.append(h('div', { class: 'card soft' }, h('h3', {}, 'Danger zone'),
    h('button', { class: 'btn red sm', type: 'button', onclick: () => { if (confirm('Erase ALL progress? This cannot be undone. Export first if unsure.')) { resetAll(); toast('Progress reset'); location.hash = '#/home'; location.reload(); } } }, 'Reset all progress')));

  el.append(h('p', { class: 'small muted center mt' }, 'Русский · built for one determined learner. Add it to your home screen for the full-screen app experience.'));
  return el;
}
