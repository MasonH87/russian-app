# Русский · a personal Russian course app

A Duolingo-style, class-structured Russian course that runs in any browser. No build step, no account, no server beyond a static file host. Progress is stored in the browser and can be exported to a file.

## Run it

Any static file server works. With Python installed:

```bash
python -m http.server 8765
```

Then open http://localhost:8765. On a phone, host the folder somewhere with HTTPS (GitHub Pages is free: push this folder to a repo, enable Pages, open the URL, then "Add to Home Screen"). The service worker makes it work offline after the first load.

## What is inside

| Area | What it does |
|---|---|
| **Learn** | Course map. Unit 0 is an eight-lesson alphabet bootcamp (letters plus a vowel-sounds lesson) with an exam. Unit 2 covers family, “I have”, numbers to 100, ages, plurals and professions. Unit 1 is five authored lessons on greetings, "how are you", names, where you are from, and noun gender, plus a unit test. Lessons unlock in order; tests unlock the next unit at 80%. |
| **Lesson flow** | Short lecture slides (tap any bold word to hear it), then 16 to 20 exercises. Wrong answers come back at the end of the lesson. Enter checks and continues. |
| **Exercise types** | Multiple choice, match pairs, listen and type (with an on-screen ЙЦУКЕН keyboard), build the sentence from tiles, fill the blank, typed translation (typo-tolerant), and speak it (browser speech recognition, self-graded fallback). |
| **Review** | SM-2 spaced repetition over every word and letter you have met. Exercise type adapts to how well you know the card. Missed cards repeat inside the session until you get them. |
| **Mastery gates** | Lessons need 80% to count as passed. More than 8 due cards blocks new lessons until you review. Away 5+ days with a deck of 10+ cards triggers a checkpoint quiz (20 cards, 80%) before anything new unlocks; missed cards go back to the front of the queue. Thresholds live in `GATE` in `js/content.js`. |
| **Homework** | Each lesson assigns one real-world task to do with your partner. Marking it done and having her confirm it earns XP and a badge. |
| **Gamification** | XP, levels with Russian titles, daily goal ring, streak with freezes, 15 badges, crowns for perfect lessons. |
| **Rubles and shop** | A spendable currency (₽) earned alongside XP (1 per 10 XP plus bonuses for first passes, perfect lessons, tests, homework, weekly streaks). The shop sells avatars, Russian titles, colour themes, streak freezes and double-XP tokens. Nothing in the shop bypasses the mastery gates. Items live in `ITEMS` in `js/shop.js`. |
| **Swipe navigation** | On touch screens, swipe left or right anywhere on a page to move between the five tabs. |
| **Where you stand** | Profile card mapping your progress to a native-speaker age equivalent, a usefulness tier (Sign reader → Polite tourist → … → Independent tourist) and the CEFR/TORFL level, plus the concrete conditions for booking the real exam. Tiers are defined in `TIERS` in `js/gamify.js`. |
| **Profile** | Level, 14-day activity chart, vocabulary mastery, letters learned, badges, road-to-TORFL progress, and a one-click coach report to paste into a chat with Claude. |
| **Settings** | Name, daily goal, light/dark, voice choice, autoplay, slow speech, speaking exercises on/off, keyboard on/off, export/import progress, reset. |

## Files

```
index.html            app shell
css/styles.css        all styling (design tokens at the top)
js/app.js             router + top bar
js/session.js         lesson/test/review runner (progress bar, feedback, results)
js/exercises.js       the seven exercise renderers
js/keyboard.js        on-screen Cyrillic keyboard
js/srs.js             SM-2 scheduling
js/state.js           progress store (localStorage), streaks, XP
js/gamify.js          levels, badges
js/generate.js        builds review exercises from cards
js/content.js         registry of units, words, unlock rules, homework
js/views/*.js         one file per screen
data/alphabet.js      33 letters, groups, reading words, transliteration
data/units/u0.js      alphabet lessons (generated from data/alphabet.js)
data/units/u1.js      Unit 1 lessons (authored)
data/units/index.js   course outline, including planned units
sw.js                 offline cache
```

## Adding a lesson

Add an object to the `lessons` array in a unit file. Fields: `id`, `title`, `icon`, `lecture` (slides with `title` + `html`, or `letters`/`words` lists), `vocab` (`{ru, en, accept?}`, stress marked with the combining acute ́), `exercises`, `homework`. Exercise shapes:

```js
{ type: 'mc', prompt, big?, audio?, options: [], answer, explain?, speakOptions?, bigOptions? }
{ type: 'match', pairs: [[ru, en], ...] }
{ type: 'listen_type', audio, answer, accept?, hint? }
{ type: 'tiles', prompt, answer, tiles?: [], accept? }
{ type: 'fill', sentence: 'Как ___ зовут?', options: [], answer, translation?, explain? }
{ type: 'translate', prompt, answer, accept?, dir: 'en-ru' | 'ru-en' }
{ type: 'speak', text, en }
```

New words are added to the review deck automatically when the lesson is first completed.

## Roadmap (Phase 1 → TORFL Elementary / A1)

- Unit 2: Family and "I have" (у меня есть), numbers to 100, age, plurals, professions — **done**
- Unit 3: Present-tense verbs, daily routine, questions
- Unit 4: Prepositional and accusative cases
- Unit 5: Food, ordering, likes and dislikes
- Unit 6: Past tense, genitive basics, dates
- Unit 7: Mock TORFL Elementary exam (vocabulary/grammar, reading, listening, writing, speaking)

Phase 2 continues to TORFL Basic (A2).
