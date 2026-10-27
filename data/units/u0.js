// Unit 0: the alphabet bootcamp. Lessons are generated from data/alphabet.js so every attempt is a little different.
import { GROUPS, LETTERS, lettersInGroup, lettersUpTo, WORDS_BY_GROUP, translit, fakeTranslits } from '../alphabet.js';
import { sample, shuffle, stripStress } from '../../js/util.js';

const disp = l => `${l.up} ${l.low}`;

// Reading words worth keeping in the long-term vocabulary deck (the rest are just for decoding practice).
const KEEP = new Set(['мама', 'кот', 'нет', 'он', 'она', 'утро', 'сестра', 'брат', 'друг', 'дом', 'да', 'книга', 'вода', 'город',
  'привет', 'пока', 'спасибо', 'это', 'папа', 'стол', 'телефон', 'хорошо', 'пожалуйста', 'что', 'чай', 'школа', 'машина', 'муж',
  'я', 'ты', 'мы', 'вы', 'россия', 'яблоко', 'язык', 'ещё', 'рыба', 'музыка', 'день', 'очень', 'семья', 'пять', 'здесь', 'друзья', 'любовь']);

function letterExercises(letters, known) {
  return letters.map((l, i) => {
    const others = sample(known.filter(x => x.up !== l.up && x.sound !== l.sound), 3);
    if (others.length < 3) others.push(...sample(LETTERS.filter(x => x.up !== l.up && x.sound !== l.sound && !others.includes(x)), 3 - others.length));
    return i % 2 === 0
      ? { type: 'mc', prompt: 'What sound does this letter make?', big: disp(l), hint: `Letter name: ${l.name}`, options: [l.sound, ...others.map(o => o.sound)], answer: l.sound, speakAfter: l.ex, explain: l.tip }
      : { type: 'mc', prompt: `Which letter makes the sound “${l.sound}”?`, options: [l, ...others].map(disp), answer: disp(l), bigOptions: true, speakAfter: l.name, explain: l.tip };
  });
}
function listenExercises(letters, known, n) {
  return sample(letters, Math.min(n, letters.length)).map(l => {
    const others = sample(known.filter(x => x.up !== l.up), 3);
    if (others.length < 3) others.push(...sample(LETTERS.filter(x => x.up !== l.up && !others.includes(x)), 3 - others.length));
    return { type: 'mc', prompt: 'Tap the letter you hear', audio: l.name, options: [l, ...others].map(disp), answer: disp(l), bigOptions: true, explain: `${disp(l)} is called “${l.name}” and sounds like “${l.sound}”.` };
  });
}
function readExercises(words, n) {
  return sample(words, n).map(w => {
    const t = translit(w.ru);
    return { type: 'mc', prompt: 'How do you read this word?', big: w.ru, options: [t, ...fakeTranslits(w.ru, 2)], answer: t, speakAfter: w.ru, explain: `${stripStress(w.ru)} = ${w.en}` };
  });
}
function meaningExercises(words, n) {
  return sample(words, n).map(w => {
    const others = sample(words.filter(x => x !== w && x.en !== w.en), 3);
    return { type: 'mc', prompt: 'What does this word mean?', big: w.ru, audio: w.ru, options: [w.en, ...others.map(o => o.en)], answer: w.en };
  });
}
function typeExercises(words, n) {
  const short = words.filter(w => stripStress(w.ru).length <= 6 && !/^[А-ЯЁ]/.test(stripStress(w.ru)));
  return sample(short.length >= n ? short : words, n).map(w => ({ type: 'listen_type', audio: w.ru, answer: w.ru, hint: `Meaning: ${w.en}` }));
}
function matchExercise(letters) {
  const ls = letters.length >= 5 ? sample(letters, 5) : [...letters, ...sample(LETTERS.filter(l => !letters.includes(l)), 5 - letters.length)];
  return { type: 'match', prompt: 'Match each letter to its sound.', pairs: ls.map(l => [disp(l), l.sound]) };
}

const HOMEWORK = [
  { title: 'Handwriting + her name', text: 'Write А К М О Т Е by hand, upper and lower case, five times each. Then ask your girlfriend to write her name in Cyrillic and read it back to her, letter by letter.' },
  { title: 'Word hunt', text: 'Find five Russian words on her phone, in her messages, or on food packaging that use only letters you know so far (А К М О Т Е В Н Р С У Х). Read them aloud to her.' },
  { title: 'Dictation, part 1', text: 'Ask her to write five short words using Б Г Д З И. Read them aloud; she grades your reading from 1 to 5.' },
  { title: 'Text her in Cyrillic', text: 'Add the Russian keyboard to your phone. Text her «привет» in the morning and «пока» when you leave, typed in Cyrillic. Ask her to reply with one short word you can sound out.' },
  { title: 'The hushers', text: 'Ask her to say five words containing ж, ц, ч, ш or щ slowly. Write what you hear in Cyrillic and check together. Bonus: say «пожалуйста» until she approves.' },
  { title: 'Cities', text: 'Read five Russian city names together: Москва, Санкт-Петербург, Казань, Сочи, Новосибирск. Then learn to say the name of her home town perfectly.' },
  { title: 'Full alphabet from memory', text: 'Handwrite all 33 letters in order from memory and have her check it. Then read one short Russian children’s rhyme or song title together, slowly.' },
];

function buildLesson(group, idx) {
  const letters = lettersInGroup(group.id);
  const known = lettersUpTo(group.id);
  const words = WORDS_BY_GROUP[group.id];
  return {
    id: `u0-l${idx + 1}`, title: group.title, ru: group.ru, icon: group.icon,
    letters: letters.map(l => l.up),
    vocab: words.filter(w => KEEP.has(stripStress(w.ru).toLowerCase())),
    lecture: [
      { title: `${group.icon} ${group.title}`, html: group.intro },
      { title: 'Meet the letters', letters, footer: 'Tap 🔊 to hear each letter’s name. Say each one out loud three times and trace it with your finger.' },
      { title: 'Read these words', words: words.map(w => ({ ...w, translit: translit(w.ru) })), footer: 'Read each word aloud <b>before</b> tapping play, then compare. The mark ́ shows the stressed syllable.' },
    ],
    build() {
      const drills = shuffle([...letterExercises(letters, known), matchExercise(letters), ...listenExercises(letters, known, 3)]);
      const reading = shuffle([...readExercises(words, 5), ...meaningExercises(words, 3), ...typeExercises(words, 2)]);
      return [...drills, ...reading];
    },
    homework: HOMEWORK[idx],
  };
}

/* ───── Lesson 8: the five vowel sounds (minimal pairs + stress) ───── */
const S = (ru, en) => `<b data-say="${ru}">${ru}</b>${en ? ` <span class="muted">(${en})</span>` : ''}`;
const PAIRS = [
  ['мат', 'мать', 'checkmate / mother', 'ь softens the т'], ['брат', 'брать', 'brother / to take', 'ь softens the т'],
  ['лук', 'люк', 'onion / hatch', 'у vs ю: same "oo", ю softens the л'], ['был', 'бил', 'was / hit', 'ы vs и'],
  ['сад', 'сядь', 'garden / sit down!', 'а vs я: same "a", я softens the с'], ['мал', 'мял', 'small / crumpled', 'а vs я: same "a", я softens the м'],
  ['угол', 'уголь', 'corner / coal', 'ь softens the л'], ['мыл', 'мил', 'washed / nice', 'ы vs и'],
];
const STRESS = [['молоко́', 'milk', ['мо-', '-ло-', '-ко'], '-ко'], ['соба́ка', 'dog', ['со-', '-ба-', '-ка'], '-ба-'], ['хорошо́', 'good', ['хо-', '-ро-', '-шо'], '-шо'],
  ['спаси́бо', 'thank you', ['спа-', '-си-', '-бо'], '-си-'], ['Москва́', 'Moscow', ['Мос-', '-ква'], '-ква'], ['ба́бушка', 'grandmother', ['ба-', '-буш-', '-ка'], 'ба-']];
const VOWELS = {
  id: 'u0-l8', title: 'The five vowel sounds', ru: 'Пять гласных звуков', icon: '🎙️',
  letters: [],
  vocab: [{ ru: 'мать', en: 'mother' }, { ru: 'брать', en: 'to take' }, { ru: 'лук', en: 'onion' }, { ru: 'был', en: 'was' }, { ru: 'молоко́', en: 'milk' }, { ru: 'сад', en: 'garden' }],
  lecture: [
    { title: '🎙️ Ten letters, five sounds', html: `
      <p>Russian has 10 vowel <em>letters</em> but only 5 vowel <em>sounds</em>. They come in pairs. The second letter of each pair makes the same sound, but either adds a "y" in front (at the start of a word or after a vowel) or <b>softens the consonant before it</b>.</p>
      <table><tr><th>sound</th><th>plain</th><th>soft / "y" version</th><th>hear it</th></tr>
      <tr><td>a</td><td>а</td><td>я</td><td>${S('мал')} · ${S('мял')}</td></tr>
      <tr><td>e</td><td>э</td><td>е</td><td>${S('э́то')} · ${S('е́сли')}</td></tr>
      <tr><td>o</td><td>о</td><td>ё</td><td>${S('нос')} · ${S('нёс')}</td></tr>
      <tr><td>u</td><td>у</td><td>ю</td><td>${S('лук')} · ${S('люк')}</td></tr>
      <tr><td>i</td><td>ы</td><td>и</td><td>${S('был')} · ${S('бил')}</td></tr></table>
      <div class="callout"><p>"Soft" means the tongue arches up toward the roof of the mouth, as if a tiny "y" were glued to the consonant. <b>ль</b> ≈ the l in <em>million</em>; <b>ть</b> ≈ the t in <em>tune</em> (British).</p></div>` },
    { title: 'Stress decides everything', html: `
      <p>Only the <b>stressed</b> vowel is pronounced clearly. The others shrink:</p>
      <ul><li>unstressed <b>о</b> → sounds like <b>а</b>: ${S('молоко́')} = <em>ma-la-KO</em>, ${S('хорошо́')} = <em>kha-ra-SHO</em></li>
      <li>unstressed <b>е</b> and <b>я</b> → drift toward <b>и</b>: ${S('сестра́')} ≈ <em>sis-TRA</em>, ${S('язы́к')} ≈ <em>yi-ZYK</em></li>
      <li>unstressed <b>а</b> stays "a" but short and lazy: ${S('соба́ка')} = <em>sa-BA-ka</em></li></ul>
      <div class="callout"><p>Practical rule: find the stress mark, say that syllable <b>loud and long</b>, and mumble everything else. Russians genuinely mumble unstressed vowels. If you pronounce every vowel clearly you will sound like a robot.</p></div>
      <p>Minimal pairs to train your ear (tap to hear):</p>
      <ul>${PAIRS.map(([a, b, en, why]) => `<li>${S(a)} / ${S(b)} — ${en}. <span class="muted">${why}</span></li>`).join('')}</ul>` },
  ],
  build() {
    const hear = PAIRS.map(([a, b, en]) => { const pick = Math.random() < 0.5 ? a : b; return { type: 'mc', prompt: 'Which word do you hear?', audio: pick, options: [a, b], answer: pick, explain: `${a} / ${b} = ${en}` }; });
    const SOFT = { я: 'я (ya)', е: 'е (ye)', ё: 'ё (yo)', ю: 'ю (yu)', и: 'и (ee)' };
    const pairs = [['а', 'я'], ['э', 'е'], ['о', 'ё'], ['у', 'ю'], ['ы', 'и']].map(([p, s]) => ({ type: 'mc', prompt: `Which letter is the soft / "y" version of ${p}?`, big: p, options: Object.values(SOFT), answer: SOFT[s], speakAfter: s }));
    const stress = STRESS.map(([w, en, opts, ans]) => ({ type: 'mc', prompt: 'Which syllable is stressed?', big: w, audio: w, options: opts, answer: ans, explain: `${w} = ${en}` }));
    const rules = [
      { type: 'mc', prompt: 'How does an unstressed о sound?', options: ['like а', 'like о, just quieter', 'like у', 'it is silent'], answer: 'like а', explain: 'Москва = mahsk-VA, хорошо = kha-ra-SHO.' },
      { type: 'mc', prompt: 'What does the soft sign ь do?', options: ['softens the consonant before it', 'adds an "o" sound', 'makes the vowel longer', 'nothing, it is decorative'], answer: 'softens the consonant before it', explain: 'мат (checkmate) vs мать (mother).' },
      { type: 'listen_type', audio: 'мать', answer: 'мать', hint: 'mother. Listen for the soft ending.' },
      { type: 'listen_type', audio: 'лук', answer: 'лук', hint: 'onion' },
      { type: 'listen_type', audio: 'молоко́', answer: 'молоко', hint: 'milk. Three о, but only the last is stressed, so it is written о even where you hear а.' },
    ];
    return [...shuffle(pairs).slice(0, 3), ...shuffle(hear), ...shuffle(stress).slice(0, 4), ...rules];
  },
  homework: { title: 'Minimal pairs with her', text: 'Have her say these pairs in random order while you point at the one you hear: мат/мать, лук/люк, был/бил, нос/нёс. Then swap: you say them, she points. Aim for 8 out of 8 both ways. Write your score in the note.' },
};

export const U0 = {
  id: 'u0', num: 0, title: 'The Alphabet', ru: 'Алфавит', icon: '🔤',
  desc: 'Read all 33 Cyrillic letters, sound out real words, and train your ear on the five vowel sounds.',
  lessons: [...GROUPS.map(buildLesson), VOWELS],
  test: {
    id: 'u0-test', title: 'Alphabet exam', icon: '🏆', passMark: 80,
    desc: 'Read 8 words, identify letters, type what you hear. Pass with 80% to unlock Unit 1.',
    build() {
      const all = Object.values(WORDS_BY_GROUP).flat();
      return shuffle([...readExercises(all, 8), ...letterExercises(sample(LETTERS, 6), LETTERS), ...meaningExercises(all, 3), ...typeExercises(all, 3)]);
    },
  },
};
