// The 33 letters of the Russian alphabet, grouped into bootcamp lessons.
import { stripStress, sample, shuffle } from '../js/util.js';

export const GROUPS = [
  { id: 'g1', title: 'Old friends', ru: 'Старые друзья', icon: '🤝',
    intro: `<p>Six letters look like English letters <em>and</em> sound almost the same. That means you can read real Russian words in the next two minutes.</p>
    <div class="callout"><p>🎯 Goal of this lesson: recognise <b>А К М О Т Е</b> instantly and read 8 words.</p></div>` },
  { id: 'g2', title: 'False friends', ru: 'Ложные друзья', icon: '🎭',
    intro: `<p>These six look like letters you know but make a <b>different</b> sound. This is where most beginners trip, so we drill them hard.</p>
    <div class="callout"><p>Memory hook: <b>В</b>ера is <b>V</b>era, <b>Н</b>ет is <b>n</b>yet, <b>Р</b>оссия is <b>R</b>ussia, <b>С</b> is always <b>s</b>, <b>У</b> is <b>oo</b>, <b>Х</b> is the throaty <b>kh</b>.</p></div>` },
  { id: 'g3a', title: 'New shapes I', ru: 'Новые буквы I', icon: '🧩',
    intro: `<p>New shapes, but sounds you already have in English. Nothing tricky here, just new pictures to attach to familiar sounds.</p>` },
  { id: 'g3b', title: 'New shapes II', ru: 'Новые буквы II', icon: '🧩',
    intro: `<p>Five more new shapes with familiar sounds. After this lesson you can read <b>привет</b> (hi), <b>пока</b> (bye) and <b>спасибо</b> (thanks).</p>
    <div class="callout"><p>Watch <b>Э</b> vs <b>Е</b>: Э is a plain "e" (э́то = EH-ta). Е has a y-glide (нет = nyet).</p></div>` },
  { id: 'g4', title: 'Hushers and buzzers', ru: 'Шипящие', icon: '🐍',
    intro: `<p>Five letters for sounds English writes with two letters: <b>zh, ts, ch, sh, shch</b>. Russians call Ж Ч Ш Щ the <em>hushers</em>.</p>
    <div class="callout"><p>Shape tricks: Ш has three teeth and a flat bottom. Щ is Ш with a little tail. Ц has a tail too but only two teeth. Ч is an upside-down chair.</p></div>` },
  { id: 'g5', title: 'The y-vowels', ru: 'Йотированные гласные', icon: '🎵',
    intro: `<p>Russian has pairs of vowels: a plain one and a "y" one. You already know <b>Е</b> (ye). Here are <b>Я</b> (ya), <b>Ю</b> (yu), <b>Ё</b> (yo), plus the famous <b>Ы</b>.</p>
    <table><tr><th>plain</th><th>with y</th></tr><tr><td>А a</td><td>Я ya</td></tr><tr><td>Э e</td><td>Е ye</td></tr><tr><td>О o</td><td>Ё yo</td></tr><tr><td>У oo</td><td>Ю yu</td></tr><tr><td>Ы ɨ</td><td>И ee</td></tr></table>
    <div class="callout"><p>After a consonant, the y-vowels mostly just <em>soften</em> that consonant: <b>тётя</b> (aunt) is "TYO-tya", not "t-yo-t-ya".</p></div>` },
  { id: 'g6', title: 'The two signs and reading rules', ru: 'Знаки и правила чтения', icon: '🔑',
    intro: `<p>The last two letters have <b>no sound of their own</b>. They change the letter before them.</p>
    <ul><li><b>Ь</b> (soft sign) softens the consonant: <b>мат</b> (checkmate) vs <b>мать</b> (mother).</li>
    <li><b>Ъ</b> (hard sign) is rare: it separates a prefix from a y-vowel so you hear the "y": <b>объект</b> = ob-YEKT.</li></ul>
    <h3>Three reading rules that make you sound Russian</h3>
    <ul><li><b>Stress rules everything.</b> Unstressed <b>о</b> sounds like <b>a</b>: <b>Москва</b> = mahsk-VA, <b>хорошо</b> = kha-ra-SHO.</li>
    <li><b>Unstressed е and я</b> drift towards "i": <b>сестра</b> ≈ sis-TRA.</li>
    <li><b>Final consonants go quiet:</b> б→p, в→f, г→k, д→t, ж→sh, з→s at the end of a word. <b>друг</b> = druk, <b>хлеб</b> = khlep.</li></ul>` },
];

// name = how Russians say the letter; sound = short label used in exercises; tip = explanation.
export const LETTERS = [
  { up: 'А', low: 'а', name: 'а', sound: 'a', group: 'g1', tip: 'Like "a" in father. Never "ay".', ex: 'ма́ма' },
  { up: 'К', low: 'к', name: 'ка', sound: 'k', group: 'g1', tip: 'Like "k" in kit.', ex: 'кот' },
  { up: 'М', low: 'м', name: 'эм', sound: 'm', group: 'g1', tip: 'Like "m" in mom.', ex: 'ма́ма' },
  { up: 'О', low: 'о', name: 'о', sound: 'o', group: 'g1', tip: 'Stressed: "o" as in more. Unstressed it relaxes to "a".', ex: 'кот' },
  { up: 'Т', low: 'т', name: 'тэ', sound: 't', group: 'g1', tip: 'Like "t" in top.', ex: 'там' },
  { up: 'Е', low: 'е', name: 'е', sound: 'ye', group: 'g1', tip: '"ye" as in yes. After a consonant it mostly softens it: нет ≈ nyet.', ex: 'нет' },

  { up: 'В', low: 'в', name: 'вэ', sound: 'v', group: 'g2', tip: 'Looks like B, sounds like V. Ве́ра = Vera.', ex: 'вот' },
  { up: 'Н', low: 'н', name: 'эн', sound: 'n', group: 'g2', tip: 'Looks like H, sounds like N. Нет = nyet.', ex: 'нет' },
  { up: 'Р', low: 'р', name: 'эр', sound: 'r (rolled)', group: 'g2', tip: 'Looks like P, sounds like a rolled R.', ex: 'рука́' },
  { up: 'С', low: 'с', name: 'эс', sound: 's', group: 'g2', tip: 'Looks like C, always sounds like S.', ex: 'сон' },
  { up: 'У', low: 'у', name: 'у', sound: 'oo', group: 'g2', tip: 'Looks like Y, sounds like "oo" in boot.', ex: 'у́тро' },
  { up: 'Х', low: 'х', name: 'ха', sound: 'kh', group: 'g2', tip: 'Looks like X, sounds like the "ch" in Scottish loch or Bach.', ex: 'са́хар' },

  { up: 'Б', low: 'б', name: 'бэ', sound: 'b', group: 'g3a', tip: 'Like "b" in bat. Lowercase б looks like a 6.', ex: 'брат' },
  { up: 'Г', low: 'г', name: 'гэ', sound: 'g', group: 'g3a', tip: 'Like "g" in go. (In the ending -ого it sounds like v.)', ex: 'го́род' },
  { up: 'Д', low: 'д', name: 'дэ', sound: 'd', group: 'g3a', tip: 'Like "d" in dog. Lowercase д looks like a little house.', ex: 'дом' },
  { up: 'З', low: 'з', name: 'зэ', sound: 'z', group: 'g3a', tip: 'Like "z" in zoo. Looks like a 3.', ex: 'зима́' },
  { up: 'И', low: 'и', name: 'и', sound: 'ee', group: 'g3a', tip: '"ee" as in see. A backwards N.', ex: 'кни́га' },

  { up: 'Й', low: 'й', name: 'и краткое', sound: 'y (short)', group: 'g3b', tip: '"y" as in boy: a short glide. Called "и краткое" (short i).', ex: 'мой' },
  { up: 'Л', low: 'л', name: 'эль', sound: 'l', group: 'g3b', tip: 'Like "l" in lamp.', ex: 'стол' },
  { up: 'П', low: 'п', name: 'пэ', sound: 'p', group: 'g3b', tip: 'Like "p" in pot (Greek pi).', ex: 'па́па' },
  { up: 'Ф', low: 'ф', name: 'эф', sound: 'f', group: 'g3b', tip: 'Like "f" in fun.', ex: 'футбо́л' },
  { up: 'Э', low: 'э', name: 'э', sound: 'e', group: 'g3b', tip: '"e" as in met, with no y-glide. Э́то = EH-ta.', ex: 'э́то' },

  { up: 'Ж', low: 'ж', name: 'жэ', sound: 'zh', group: 'g4', tip: '"zh" like the s in pleasure. Looks like a beetle (жук!).', ex: 'журна́л' },
  { up: 'Ц', low: 'ц', name: 'цэ', sound: 'ts', group: 'g4', tip: '"ts" as in cats. Little tail bottom-right.', ex: 'центр' },
  { up: 'Ч', low: 'ч', name: 'че', sound: 'ch', group: 'g4', tip: '"ch" as in chat. Looks like an upside-down chair.', ex: 'чай' },
  { up: 'Ш', low: 'ш', name: 'ша', sound: 'sh', group: 'g4', tip: '"sh" as in shop. Three teeth, flat bottom.', ex: 'шко́ла' },
  { up: 'Щ', low: 'щ', name: 'ща', sound: 'shch', group: 'g4', tip: 'A softer, longer "sh", like "fresh sheets". Has a tail.', ex: 'борщ' },

  { up: 'Я', low: 'я', name: 'я', sound: 'ya', group: 'g5', tip: '"ya" as in yard. Also the word for "I".', ex: 'я' },
  { up: 'Ю', low: 'ю', name: 'ю', sound: 'yu', group: 'g5', tip: '"yu" as in you.', ex: 'Ю́ра' },
  { up: 'Ё', low: 'ё', name: 'ё', sound: 'yo', group: 'g5', tip: '"yo" as in yoghurt. Always stressed! Often printed as е.', ex: 'ёлка' },
  { up: 'Ы', low: 'ы', name: 'ы', sound: 'ɨ (hard i)', group: 'g5', tip: 'No English match: say "ee" with your tongue pulled back, deep in the throat.', ex: 'ты' },

  { up: 'Ь', low: 'ь', name: 'мягкий знак', sound: 'soft sign', group: 'g6', tip: 'No sound. Softens the consonant before it (т → ть, like a tiny "y").', ex: 'день' },
  { up: 'Ъ', low: 'ъ', name: 'твёрдый знак', sound: 'hard sign', group: 'g6', tip: 'Rare. Separates a consonant from a following я/е/ю/ё: объе́кт = ob-YEKT.', ex: 'объе́кт' },
];

export const letterByUp = Object.fromEntries(LETTERS.map(l => [l.up, l]));
export const lettersInGroup = gid => LETTERS.filter(l => l.group === gid);
/** All letters taught up to and including a group. */
export function lettersUpTo(gid) {
  const idx = GROUPS.findIndex(g => g.id === gid);
  const ids = GROUPS.slice(0, idx + 1).map(g => g.id);
  return LETTERS.filter(l => ids.includes(l.group));
}

// Reading practice words. Each list only uses letters taught so far.
export const WORDS_BY_GROUP = {
  g1: [
    { ru: 'ма́ма', en: 'mom' }, { ru: 'кот', en: 'cat' }, { ru: 'там', en: 'there' }, { ru: 'кто', en: 'who' },
    { ru: 'а́том', en: 'atom' }, { ru: 'те́ма', en: 'topic' }, { ru: 'коме́та', en: 'comet' }, { ru: 'кака́о', en: 'cocoa' },
    { ru: 'мак', en: 'poppy' }, { ru: 'Том', en: 'Tom' },
  ],
  g2: [
    { ru: 'Москва́', en: 'Moscow' }, { ru: 'нет', en: 'no' }, { ru: 'он', en: 'he' }, { ru: 'она́', en: 'she' },
    { ru: 'у́тро', en: 'morning' }, { ru: 'са́хар', en: 'sugar' }, { ru: 'рука́', en: 'hand' }, { ru: 'метро́', en: 'metro' },
    { ru: 'рестора́н', en: 'restaurant' }, { ru: 'сестра́', en: 'sister' }, { ru: 'ко́смос', en: 'space, cosmos' },
    { ru: 'вот', en: 'here (it is)' }, { ru: 'сон', en: 'sleep, dream' }, { ru: 'нос', en: 'nose' },
  ],
  g3a: [
    { ru: 'банк', en: 'bank' }, { ru: 'брат', en: 'brother' }, { ru: 'друг', en: 'friend' }, { ru: 'дом', en: 'house, home' },
    { ru: 'да', en: 'yes' }, { ru: 'зима́', en: 'winter' }, { ru: 'кни́га', en: 'book' }, { ru: 'вода́', en: 'water' },
    { ru: 'го́род', en: 'city' }, { ru: 'до́ктор', en: 'doctor' }, { ru: 'студе́нт', en: 'student' }, { ru: 'авто́бус', en: 'bus' },
    { ru: 'Кана́да', en: 'Canada' }, { ru: 'обе́д', en: 'lunch' },
  ],
  g3b: [
    { ru: 'приве́т', en: 'hi' }, { ru: 'пока́', en: 'bye' }, { ru: 'спаси́бо', en: 'thank you' }, { ru: 'э́то', en: 'this (is)' },
    { ru: 'футбо́л', en: 'football' }, { ru: 'интерне́т', en: 'internet' }, { ru: 'па́па', en: 'dad' }, { ru: 'парк', en: 'park' },
    { ru: 'стол', en: 'table' }, { ru: 'мой', en: 'my' }, { ru: 'музе́й', en: 'museum' }, { ru: 'кафе́', en: 'cafe' },
    { ru: 'телефо́н', en: 'phone' }, { ru: 'поэ́т', en: 'poet' }, { ru: 'спорт', en: 'sport' }, { ru: 'Байка́л', en: 'Baikal' },
  ],
  g4: [
    { ru: 'хорошо́', en: 'good, well' }, { ru: 'пожа́луйста', en: 'please' }, { ru: 'что', en: 'what' }, { ru: 'чай', en: 'tea' },
    { ru: 'час', en: 'hour' }, { ru: 'шко́ла', en: 'school' }, { ru: 'маши́на', en: 'car' }, { ru: 'журна́л', en: 'magazine' },
    { ru: 'борщ', en: 'borscht' }, { ru: 'муж', en: 'husband' }, { ru: 'у́лица', en: 'street' }, { ru: 'центр', en: 'centre' },
    { ru: 'цирк', en: 'circus' }, { ru: 'у́жин', en: 'dinner' }, { ru: 'Пари́ж', en: 'Paris' },
  ],
  g5: [
    { ru: 'я', en: 'I' }, { ru: 'ты', en: 'you (informal)' }, { ru: 'мы', en: 'we' }, { ru: 'вы', en: 'you (formal / plural)' },
    { ru: 'Росси́я', en: 'Russia' }, { ru: 'моя́', en: 'my (feminine)' }, { ru: 'я́блоко', en: 'apple' }, { ru: 'ры́ба', en: 'fish' },
    { ru: 'му́зыка', en: 'music' }, { ru: 'ёлка', en: 'fir tree' }, { ru: 'язы́к', en: 'language, tongue' }, { ru: 'ещё', en: 'still, more' },
    { ru: 'сын', en: 'son' }, { ru: 'тётя', en: 'aunt' }, { ru: 'дя́дя', en: 'uncle' }, { ru: 'самолёт', en: 'airplane' },
  ],
  g6: [
    { ru: 'день', en: 'day' }, { ru: 'о́чень', en: 'very' }, { ru: 'семья́', en: 'family' }, { ru: 'пять', en: 'five' },
    { ru: 'здесь', en: 'here' }, { ru: 'ма́льчик', en: 'boy' }, { ru: 'учи́тель', en: 'teacher' }, { ru: 'любо́вь', en: 'love' },
    { ru: 'друзья́', en: 'friends' }, { ru: 'объе́кт', en: 'object' }, { ru: 'рубль', en: 'rouble' }, { ru: 'дочь', en: 'daughter' },
    { ru: 'мать', en: 'mother' }, { ru: 'подъе́зд', en: 'entrance (of a building)' },
  ],
};

/* ───── Transliteration ───── */
const MAP = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: "'", э: 'e', ю: 'yu', я: 'ya' };
const VOWELS = 'аеёиоуыэюя';
function tl(chars, i, override) {
  const ch = chars[i], lower = ch.toLowerCase(), isUp = ch !== lower;
  let out = override ?? MAP[lower] ?? ch;
  if (override == null && lower === 'е' && (i === 0 || VOWELS.includes(chars[i - 1].toLowerCase()) || 'ьъ'.includes(chars[i - 1].toLowerCase()))) out = 'ye';
  return isUp ? out.charAt(0).toUpperCase() + out.slice(1) : out;
}
export function translit(word) {
  const chars = [...stripStress(word)];
  return chars.map((_, i) => tl(chars, i)).join('');
}
// Letter → the "false friend" reading a beginner might wrongly produce.
const CONFUSE = { в: 'b', н: 'h', р: 'p', с: 'c', у: 'y', х: 'x', и: 'n', й: 'u', п: 'n', л: 'r', б: '6', д: 'g', з: '3', ч: '4', г: 'r', ш: 'w', щ: 'sh', ж: 'x', ц: 'u', ю: 'io', я: 'r', ы: 'bl', ё: 'e', е: 'e', э: 'ye', о: 'a' };
export function fakeTranslits(word, n = 2) {
  const chars = [...stripStress(word)];
  const correct = translit(word);
  const out = new Set();
  for (let i = 0; i < chars.length; i++) {
    const f = CONFUSE[chars[i].toLowerCase()];
    if (f == null) continue;
    const alt = chars.map((_, j) => tl(chars, j, j === i ? f : undefined)).join('');
    if (alt !== correct) out.add(alt);
  }
  if (out.size < n && /o/.test(correct)) out.add(correct.replace('o', 'a'));
  if (out.size < n && correct.length > 2) out.add(correct.slice(0, 1) + correct.slice(2, 3) + correct.slice(1, 2) + correct.slice(3));
  return sample([...out].filter(x => x !== correct), n);
}
