// Unit 2: Family, "I have", numbers, age, plurals, who is who.
const S = (ru, en) => `<b data-say="${ru}">${ru}</b>${en ? ` <span class="muted">(${en})</span>` : ''}`;

export const U2 = {
  id: 'u2', num: 2, title: 'Family and “I have”', ru: 'Семья', icon: '👨‍👩‍👧',
  desc: 'Talk about your family and hers, say what you have, count to 100, give ages, and make plurals.',
  lessons: [
    /* ───────── Lesson 1 ───────── */
    {
      id: 'u2-l1', title: 'My family and “I have”', ru: 'У меня есть', icon: '👪',
      lecture: [
        { title: '👪 Russian has no verb “to have”', html: `
          <p>Instead of "I have a brother", Russians say "by me there is a brother": ${S('У меня есть брат.')}</p>
          <table><tr><th>Russian</th><th>literally</th><th>meaning</th></tr>
          <tr><td>${S('у меня есть')}</td><td>by me there is</td><td>I have</td></tr>
          <tr><td>${S('у тебя есть')}</td><td>by you there is</td><td>you have (informal)</td></tr>
          <tr><td>${S('у вас есть')}</td><td>by you there is</td><td>you have (formal / plural)</td></tr>
          <tr><td>${S('у него есть')}</td><td>by him there is</td><td>he has</td></tr>
          <tr><td>${S('у неё есть')}</td><td>by her there is</td><td>she has</td></tr>
          <tr><td>${S('у нас есть')}</td><td>by us there is</td><td>we have</td></tr></table>
          <p>A question is the same words with rising intonation: ${S('У тебя есть брат?', 'Do you have a brother?')} Answer ${S('Да, есть.')} or ${S('Нет.')}</p>
          <div class="callout"><p>"I don't have" is ${S('у меня нет')} and the thing changes its ending: ${S('У меня нет брата.')} ${S('У меня нет сестры.')} Learn these two as fixed phrases; the ending rule (genitive case) comes in Unit 6.</p></div>` },
        { title: 'The family', html: `
          <table><tr><th></th><th></th></tr>
          <tr><td>${S('семья́')} family</td><td>${S('роди́тели')} parents</td></tr>
          <tr><td>${S('муж')} husband</td><td>${S('жена́')} wife</td></tr>
          <tr><td>${S('сын')} son</td><td>${S('дочь')} daughter</td></tr>
          <tr><td>${S('де́душка')} grandfather</td><td>${S('ба́бушка')} grandmother</td></tr>
          <tr><td>${S('дя́дя')} uncle</td><td>${S('тётя')} aunt</td></tr>
          <tr><td>${S('ребёнок')} child</td><td>${S('де́ти')} children</td></tr></table>
          <div class="callout"><p>де́душка and дя́дя end in -а but are men, so they are masculine: <b>мой</b> дедушка, <b>мой</b> дядя. For plural things "my" becomes ${S('мои')}: ${S('Это мои родители.')}</p></div>` },
      ],
      vocab: [
        { ru: 'семья́', en: 'family' }, { ru: 'муж', en: 'husband' }, { ru: 'жена́', en: 'wife' }, { ru: 'сын', en: 'son' }, { ru: 'дочь', en: 'daughter' },
        { ru: 'де́душка', en: 'grandfather' }, { ru: 'ба́бушка', en: 'grandmother' }, { ru: 'дя́дя', en: 'uncle' }, { ru: 'тётя', en: 'aunt' },
        { ru: 'роди́тели', en: 'parents' }, { ru: 'де́ти', en: 'children' }, { ru: 'ребёнок', en: 'child' },
        { ru: 'у меня́ есть', en: 'I have' }, { ru: 'у тебя́ есть', en: 'you have (informal)' }, { ru: 'у вас есть', en: 'you have (formal)' },
        { ru: 'у него́ есть', en: 'he has' }, { ru: 'у неё есть', en: 'she has' }, { ru: 'у нас есть', en: 'we have' }, { ru: 'у меня́ нет', en: 'I don’t have' }, { ru: 'мои́', en: 'my (plural)' },
      ],
      exercises: [
        { type: 'mc', prompt: 'What does this mean?', big: 'У меня есть брат.', audio: 'У меня есть брат', options: ['I have a brother.', 'I don’t have a brother.', 'He is my brother.', 'This is my brother.'], answer: 'I have a brother.' },
        { type: 'match', pairs: [['муж', 'husband'], ['жена', 'wife'], ['сын', 'son'], ['дочь', 'daughter'], ['семья', 'family']] },
        { type: 'tiles', prompt: 'Translate: I have a sister.', answer: 'У меня есть сестра.', tiles: ['У', 'меня', 'есть', 'сестра.', 'нет', 'тебя'] },
        { type: 'fill', sentence: 'У ___ есть брат?', translation: 'Do you have a brother? (to a friend)', options: ['тебя', 'меня', 'вас'], answer: 'тебя' },
        { type: 'listen_type', audio: 'семья', answer: 'семья', hint: 'family. Ends in -ья.' },
        { type: 'mc', prompt: 'Listen. What did you hear?', audio: 'У неё есть сын', options: ['She has a son.', 'He has a son.', 'She has a daughter.', 'We have a son.'], answer: 'She has a son.' },
        { type: 'tiles', prompt: 'Translate: Do you have a family? (formal)', answer: 'У вас есть семья?', tiles: ['У', 'вас', 'есть', 'семья?', 'тебя', 'нет'] },
        { type: 'match', pairs: [['дедушка', 'grandfather'], ['бабушка', 'grandmother'], ['дядя', 'uncle'], ['тётя', 'aunt'], ['родители', 'parents']] },
        { type: 'fill', sentence: 'У него ___ дочь.', translation: 'He has a daughter.', options: ['есть', 'нет', 'это'], answer: 'есть' },
        { type: 'translate', prompt: 'I have a dog.', answer: 'У меня есть собака', dir: 'en-ru' },
        { type: 'mc', prompt: 'What does this mean?', big: 'У меня нет брата.', audio: 'У меня нет брата', options: ['I don’t have a brother.', 'I have a brother.', 'My brother is not here.', 'He has no brother.'], answer: 'I don’t have a brother.', explain: 'After нет the noun changes its ending: брат → брата.' },
        { type: 'speak', text: 'У меня есть семья.', en: 'I have a family.' },
        { type: 'listen_type', audio: 'дочь', answer: 'дочь', hint: 'daughter. One syllable, soft ending.' },
        { type: 'tiles', prompt: 'Translate: This is my grandmother. Her name is Olga.', answer: 'Это моя бабушка. Её зовут Ольга.', tiles: ['Это', 'моя', 'бабушка.', 'Её', 'зовут', 'Ольга.', 'мой', 'Его'] },
        { type: 'mc', prompt: 'Which word means “children”?', options: ['дети', 'ребёнок', 'родители', 'дочь'], answer: 'дети', speakOptions: true, explain: 'ребёнок = one child, дети = children (irregular plural).' },
        { type: 'translate', prompt: 'У тебя есть сестра?', answer: 'do you have a sister', accept: ['have you got a sister', 'do you have a sister?'], dir: 'ru-en' },
        { type: 'fill', sentence: 'Это ___ родители.', translation: 'These are my parents.', options: ['мои', 'мой', 'моя'], answer: 'мои', explain: 'Plural things take мои.' },
        { type: 'mc', prompt: 'How do you say “we have”?', options: ['у нас есть', 'у вас есть', 'у них есть', 'у меня есть'], answer: 'у нас есть', speakOptions: true },
      ],
      homework: { title: 'Her family tree', text: 'Draw her family tree together and label each person in Russian (мама, папа, бабушка…). Then, pointing at each one, say «Это её мама. Её зовут …». Ask her «У тебя есть дядя?» style questions for anyone missing. Write the family words you used in the note.' },
    },

    /* ───────── Lesson 2 ───────── */
    {
      id: 'u2-l2', title: 'Numbers 1 to 10', ru: 'Числа 1–10', icon: '🔢',
      lecture: [
        { title: '🔢 Counting', html: `
          <table><tr><td>0 ${S('ноль')}</td><td>1 ${S('оди́н')}</td><td>2 ${S('два')}</td><td>3 ${S('три')}</td></tr>
          <tr><td>4 ${S('четы́ре')}</td><td>5 ${S('пять')}</td><td>6 ${S('шесть')}</td><td>7 ${S('семь')}</td></tr>
          <tr><td>8 ${S('во́семь')}</td><td>9 ${S('де́вять')}</td><td>10 ${S('де́сять')}</td><td>${S('ско́лько?')} how many?</td></tr></table>
          <div class="callout"><p>Only 1 and 2 change with gender: ${S('оди́н брат')} / ${S('одна́ сестра́')} / ${S('одно́ окно́')}; ${S('два бра́та')} / ${S('две сестры́')}. Everything from 3 up is the same for all genders.</p></div>
          <p>Russians read phone numbers in pairs or digit by digit; digit by digit is fine: ${S('два, пять, семь')} = 257.</p>` },
      ],
      vocab: [
        { ru: 'ноль', en: 'zero' }, { ru: 'оди́н', en: 'one' }, { ru: 'два', en: 'two' }, { ru: 'три', en: 'three' }, { ru: 'четы́ре', en: 'four' },
        { ru: 'пять', en: 'five' }, { ru: 'шесть', en: 'six' }, { ru: 'семь', en: 'seven' }, { ru: 'во́семь', en: 'eight' }, { ru: 'де́вять', en: 'nine' },
        { ru: 'де́сять', en: 'ten' }, { ru: 'ско́лько?', en: 'how many? how much?' }, { ru: 'одна́', en: 'one (feminine)' }, { ru: 'две', en: 'two (feminine)' }, { ru: 'но́мер', en: 'number' },
      ],
      exercises: [
        { type: 'match', pairs: [['один', '1'], ['два', '2'], ['три', '3'], ['четыре', '4'], ['пять', '5']] },
        { type: 'match', pairs: [['шесть', '6'], ['семь', '7'], ['восемь', '8'], ['девять', '9'], ['десять', '10']] },
        { type: 'mc', prompt: 'Listen. Which number?', audio: 'семь', options: ['7', '8', '6', '10'], answer: '7', bigOptions: true },
        { type: 'mc', prompt: 'Listen. Which number?', audio: 'четыре', options: ['4', '3', '2', '9'], answer: '4', bigOptions: true },
        { type: 'listen_type', audio: 'пять', answer: 'пять', hint: '5' },
        { type: 'mc', prompt: 'What does this mean?', big: 'Сколько?', audio: 'Сколько', options: ['How many?', 'How are you?', 'Which?', 'Where?'], answer: 'How many?' },
        { type: 'tiles', prompt: 'Translate: three, five, eight', answer: 'три пять восемь', tiles: ['три', 'пять', 'восемь', 'семь', 'девять'] },
        { type: 'mc', prompt: 'Which word is 8?', options: ['восемь', 'семь', 'девять', 'шесть'], answer: 'восемь', speakOptions: true },
        { type: 'listen_type', audio: 'шесть', answer: 'шесть', hint: '6' },
        { type: 'fill', sentence: 'У меня ___ сестра.', translation: 'I have one sister.', options: ['одна', 'один', 'одно'], answer: 'одна', explain: 'сестра is feminine, so одна.' },
        { type: 'fill', sentence: 'У меня ___ брат.', translation: 'I have one brother.', options: ['один', 'одна', 'одно'], answer: 'один' },
        { type: 'mc', prompt: 'Listen to the phone number.', audio: 'два, пять, семь', options: ['257', '275', '527', '752'], answer: '257', bigOptions: true },
        { type: 'mc', prompt: 'Listen to the phone number.', audio: 'девять, ноль, один', options: ['901', '910', '109', '190'], answer: '901', bigOptions: true },
        { type: 'translate', prompt: 'ten', answer: 'десять', dir: 'en-ru' },
        { type: 'speak', text: 'Один, два, три, четыре, пять.', en: 'One, two, three, four, five.' },
        { type: 'mc', prompt: 'Maths in Russian: 7 + 3 = ?', options: ['десять', 'девять', 'восемь', 'семь'], answer: 'десять', speakOptions: true },
        { type: 'mc', prompt: 'Maths in Russian: 4 + 4 = ?', options: ['восемь', 'шесть', 'семь', 'девять'], answer: 'восемь', speakOptions: true },
        { type: 'mc', prompt: 'Listen. Which number?', audio: 'девять', options: ['9', '10', '5', '7'], answer: '9', bigOptions: true },
      ],
      homework: { title: 'Phone numbers', text: 'Read her phone number aloud in Russian, digit by digit. Then she dictates three numbers (3 to 6 digits each) and you write the digits down. Note how many you got right.' },
    },

    /* ───────── Lesson 3 ───────── */
    {
      id: 'u2-l3', title: 'Numbers to 100 and your age', ru: 'Сколько тебе лет?', icon: '🎂',
      lecture: [
        { title: '🎂 Teens, tens, and compounds', html: `
          <p>11 to 19 are "unit + надцать" (on-ten): ${S('оди́ннадцать')} 11, ${S('двена́дцать')} 12, ${S('трина́дцать')} 13, ${S('четы́рнадцать')} 14, ${S('пятна́дцать')} 15, ${S('шестна́дцать')} 16, ${S('семна́дцать')} 17, ${S('восемна́дцать')} 18, ${S('девятна́дцать')} 19.</p>
          <p>Tens: ${S('два́дцать')} 20, ${S('три́дцать')} 30, ${S('со́рок')} 40, ${S('пятьдеся́т')} 50, ${S('шестьдеся́т')} 60, ${S('се́мьдесят')} 70, ${S('во́семьдесят')} 80, ${S('девяно́сто')} 90, ${S('сто')} 100.</p>
          <p>Compounds just line up: ${S('два́дцать оди́н')} 21, ${S('три́дцать пять')} 35.</p>
          <div class="callout"><p>Watch the stress: три<b>на́</b>дцать (13) vs <b>три́</b>дцать (30). Same trap as English thirteen / thirty.</p></div>` },
        { title: 'How old are you?', html: `
          <p>${S('Ско́лько тебе́ лет?', 'informal')} · ${S('Ско́лько вам лет?', 'formal')} Literally "how many years to you?"</p>
          <p>Answer: ${S('Мне два́дцать пять лет.', 'I am 25.')} · ${S('Ему́ три́дцать лет.', 'He is 30.')} · ${S('Ей два́дцать два го́да.', 'She is 22.')}</p>
          <p>The word for "years" depends on the <b>last digit</b> of the number:</p>
          <table><tr><th>last digit</th><th>word</th><th>example</th></tr>
          <tr><td>1 (but not 11)</td><td>${S('год')}</td><td>${S('два́дцать оди́н год')}</td></tr>
          <tr><td>2, 3, 4 (but not 12–14)</td><td>${S('го́да')}</td><td>${S('два́дцать три го́да')}</td></tr>
          <tr><td>5–9, 0, and 11–14</td><td>${S('лет')}</td><td>${S('два́дцать пять лет')}, ${S('двена́дцать лет')}</td></tr></table>` },
      ],
      vocab: [
        { ru: 'оди́ннадцать', en: 'eleven' }, { ru: 'двена́дцать', en: 'twelve' }, { ru: 'трина́дцать', en: 'thirteen' }, { ru: 'четы́рнадцать', en: 'fourteen' }, { ru: 'пятна́дцать', en: 'fifteen' },
        { ru: 'шестна́дцать', en: 'sixteen' }, { ru: 'семна́дцать', en: 'seventeen' }, { ru: 'восемна́дцать', en: 'eighteen' }, { ru: 'девятна́дцать', en: 'nineteen' }, { ru: 'два́дцать', en: 'twenty' },
        { ru: 'три́дцать', en: 'thirty' }, { ru: 'со́рок', en: 'forty' }, { ru: 'пятьдеся́т', en: 'fifty' }, { ru: 'сто', en: 'one hundred' },
        { ru: 'Ско́лько тебе́ лет?', en: 'How old are you? (informal)' }, { ru: 'Мне … лет', en: 'I am … years old' }, { ru: 'год', en: 'year (after 1)' }, { ru: 'го́да', en: 'years (after 2–4)' }, { ru: 'лет', en: 'years (after 5+)' },
        { ru: 'ему́', en: 'to him / he is (age)' }, { ru: 'ей', en: 'to her / she is (age)' },
      ],
      exercises: [
        { type: 'mc', prompt: 'What does this mean?', big: 'Сколько тебе лет?', audio: 'Сколько тебе лет?', options: ['How old are you?', 'How many brothers do you have?', 'How are you?', 'What year is it?'], answer: 'How old are you?' },
        { type: 'match', pairs: [['одиннадцать', '11'], ['пятнадцать', '15'], ['двадцать', '20'], ['тридцать', '30'], ['сорок', '40']] },
        { type: 'mc', prompt: 'Listen. Which number?', audio: 'тринадцать', options: ['13', '30', '3', '14'], answer: '13', bigOptions: true, explain: 'три-НА-дцать = 13. ТРИ-дцать = 30.' },
        { type: 'mc', prompt: 'Listen. Which number?', audio: 'тридцать', options: ['30', '13', '3', '33'], answer: '30', bigOptions: true, explain: 'ТРИ-дцать = 30. три-НА-дцать = 13.' },
        { type: 'fill', sentence: 'Мне двадцать пять ___.', translation: 'I am 25.', options: ['лет', 'года', 'год'], answer: 'лет', explain: 'Last digit 5 → лет.' },
        { type: 'fill', sentence: 'Мне двадцать один ___.', translation: 'I am 21.', options: ['год', 'года', 'лет'], answer: 'год', explain: 'Last digit 1 → год.' },
        { type: 'fill', sentence: 'Ей двадцать три ___.', translation: 'She is 23.', options: ['года', 'год', 'лет'], answer: 'года', explain: 'Last digit 2, 3 or 4 → года.' },
        { type: 'tiles', prompt: 'Translate: I am twenty-six.', answer: 'Мне двадцать шесть лет.', tiles: ['Мне', 'двадцать', 'шесть', 'лет.', 'года', 'Я'] },
        { type: 'listen_type', audio: 'двадцать', answer: 'двадцать', hint: '20' },
        { type: 'mc', prompt: 'Which is 16?', options: ['шестнадцать', 'шестьдесят', 'шесть', 'семнадцать'], answer: 'шестнадцать', speakOptions: true },
        { type: 'mc', prompt: 'Listen. Which number?', audio: 'пятьдесят', options: ['50', '15', '5', '55'], answer: '50', bigOptions: true },
        { type: 'tiles', prompt: 'Translate: How old are you? (formal)', answer: 'Сколько вам лет?', tiles: ['Сколько', 'вам', 'лет?', 'тебе', 'года'] },
        { type: 'translate', prompt: 'He is thirty.', answer: 'Ему тридцать лет', accept: ['ему тридцать'], dir: 'en-ru' },
        { type: 'mc', prompt: 'Which is 100?', options: ['сто', 'сорок', 'семьдесят', 'десять'], answer: 'сто', speakOptions: true },
        { type: 'speak', text: 'Мне двадцать пять лет.', en: 'I am twenty-five.' },
        { type: 'mc', prompt: 'Which is 12?', options: ['двенадцать', 'двадцать', 'два', 'девятнадцать'], answer: 'двенадцать', speakOptions: true },
        { type: 'fill', sentence: 'Ему ___ лет.', translation: 'He is 40.', options: ['сорок', 'четыре', 'четырнадцать'], answer: 'сорок' },
        { type: 'fill', sentence: 'Мне двенадцать ___.', translation: 'I am 12.', options: ['лет', 'года', 'год'], answer: 'лет', explain: '11–14 always take лет, even though 12 ends in 2.' },
      ],
      homework: { title: 'Ages', text: 'Ask her «Сколько лет твоей маме?» (how old is your mom?) and the same for three more relatives. She answers in Russian; you write the numbers. Then tell her your own age and your parents’ ages in full sentences: «Мне … лет. Моему папе … лет.»' },
    },

    /* ───────── Lesson 4 ───────── */
    {
      id: 'u2-l4', title: 'Plurals', ru: 'Множественное число', icon: '👥',
      lecture: [
        { title: '👥 Making plurals', html: `
          <table><tr><th>ending</th><th>plural</th><th>example</th></tr>
          <tr><td>consonant</td><td>+ ы</td><td>${S('стол')} → ${S('столы́')}</td></tr>
          <tr><td>-а</td><td>→ ы</td><td>${S('маши́на')} → ${S('маши́ны')}</td></tr>
          <tr><td>after к, г, х, ж, ч, ш, щ</td><td>→ и (never ы)</td><td>${S('кни́га')} → ${S('кни́ги')}, ${S('ко́шка')} → ${S('ко́шки')}</td></tr>
          <tr><td>-й, -ь, -я</td><td>→ и</td><td>${S('музе́й')} → ${S('музе́и')}, ${S('семья́')} → ${S('се́мьи')}</td></tr>
          <tr><td>-о</td><td>→ а</td><td>${S('окно́')} → ${S('о́кна')}</td></tr></table>
          <div class="callout"><p>The spelling rule "и not ы after к г х ж ч ш щ" is one of the most useful in Russian. It applies everywhere, not just plurals.</p></div>` },
        { title: 'The irregular ones you need now', html: `
          <ul><li>${S('брат')} → ${S('бра́тья')} brothers</li><li>${S('друг')} → ${S('друзья́')} friends</li><li>${S('сын')} → ${S('сыновья́')} sons</li>
          <li>${S('ребёнок')} → ${S('де́ти')} children</li><li>${S('челове́к')} → ${S('лю́ди')} people</li><li>${S('дочь')} → ${S('до́чери')} daughters</li></ul>
          <p>"My" and "this" with plurals: ${S('Это мои́ друзья́.', 'These are my friends.')} Note э́то does not change.</p>
          <div class="callout"><p>Preview: after 2, 3, 4 Russians use a special singular form, not the plural: ${S('два бра́та')}, ${S('две сестры́')}, ${S('три кни́ги')}. After 5+ a different plural form: ${S('пять книг')}. Learn the 2–4 pattern now; the rest is Unit 6.</p></div>` },
      ],
      vocab: [
        { ru: 'бра́тья', en: 'brothers' }, { ru: 'друзья́', en: 'friends' }, { ru: 'сыновья́', en: 'sons' }, { ru: 'лю́ди', en: 'people' }, { ru: 'челове́к', en: 'person' },
        { ru: 'до́чери', en: 'daughters' }, { ru: 'кни́ги', en: 'books' }, { ru: 'столы́', en: 'tables' }, { ru: 'о́кна', en: 'windows' }, { ru: 'маши́ны', en: 'cars' },
        { ru: 'ко́шки', en: 'cats' }, { ru: 'соба́ки', en: 'dogs' }, { ru: 'э́ти', en: 'these' },
      ],
      exercises: [
        { type: 'mc', prompt: 'Plural of this word?', big: 'стол', options: ['столы', 'столи', 'стола', 'столов'], answer: 'столы', speakOptions: true },
        { type: 'mc', prompt: 'Plural of this word?', big: 'книга', options: ['книги', 'книгы', 'книга', 'книгов'], answer: 'книги', speakOptions: true, explain: 'After к only и is allowed, never ы.' },
        { type: 'mc', prompt: 'Plural of this word?', big: 'окно', options: ['окна', 'окны', 'окни', 'окно'], answer: 'окна', speakOptions: true, explain: 'Neuter -о → -а, and the stress jumps: о́кна.' },
        { type: 'match', pairs: [['брат', 'братья'], ['друг', 'друзья'], ['ребёнок', 'дети'], ['человек', 'люди'], ['сын', 'сыновья']] },
        { type: 'fill', sentence: 'Это ___ дети.', translation: 'These are my children.', options: ['мои', 'мой', 'моя'], answer: 'мои' },
        { type: 'tiles', prompt: 'Translate: These are my friends.', answer: 'Это мои друзья.', tiles: ['Это', 'мои', 'друзья.', 'мой', 'друг'] },
        { type: 'listen_type', audio: 'дети', answer: 'дети', hint: 'children' },
        { type: 'mc', prompt: 'Plural of this word?', big: 'кошка', options: ['кошки', 'кошкы', 'кошка', 'кошек'], answer: 'кошки', speakOptions: true },
        { type: 'mc', prompt: 'Plural of this word?', big: 'машина', options: ['машины', 'машини', 'машина', 'машин'], answer: 'машины', speakOptions: true },
        { type: 'translate', prompt: 'my brothers', answer: 'мои братья', dir: 'en-ru' },
        { type: 'mc', prompt: 'Listen. What did you hear?', audio: 'люди', options: ['people', 'children', 'friends', 'parents'], answer: 'people' },
        { type: 'fill', sentence: 'У меня две ___.', translation: 'I have two sisters.', options: ['сестры', 'сестра', 'сестр'], answer: 'сестры', explain: 'After 2, 3, 4: the special -ы/-и form. две сестры́.' },
        { type: 'fill', sentence: 'У меня два ___.', translation: 'I have two brothers.', options: ['брата', 'брат', 'братья'], answer: 'брата', explain: 'After 2, 3, 4: два бра́та, not братья.' },
        { type: 'mc', prompt: 'Plural of this word?', big: 'собака', options: ['собаки', 'собакы', 'собака', 'собак'], answer: 'собаки', speakOptions: true, explain: 'After к → и.' },
        { type: 'speak', text: 'Это мои родители.', en: 'These are my parents.' },
        { type: 'translate', prompt: 'Это мои книги.', answer: 'these are my books', accept: ['those are my books', 'they are my books'], dir: 'ru-en' },
        { type: 'mc', prompt: 'Plural of this word?', big: 'музей', options: ['музеи', 'музеы', 'музея', 'музей'], answer: 'музеи', speakOptions: true },
        { type: 'tiles', prompt: 'Translate: I have three books.', answer: 'У меня три книги.', tiles: ['У', 'меня', 'три', 'книги.', 'книга', 'есть'] },
      ],
      homework: { title: 'Ten plurals', text: 'Walk around your home with her and name ten things in the plural: «Это окна. Это книги.» She checks each one. Then say how many you have of three things: «У меня две кошки». Note any plurals she corrected.' },
    },

    /* ───────── Lesson 5 ───────── */
    {
      id: 'u2-l5', title: 'Who is who', ru: 'Кто он?', icon: '🧑‍⚕️',
      lecture: [
        { title: '🧑‍⚕️ Saying what someone is', html: `
          <p>No "is", no "a": ${S('Моя́ ма́ма врач.', 'My mom is a doctor.')} ${S('Мой па́па инжене́р.', 'My dad is an engineer.')}</p>
          <table><tr><th>man</th><th>woman</th><th></th></tr>
          <tr><td>${S('врач')}</td><td>${S('врач')}</td><td>doctor (same word)</td></tr>
          <tr><td>${S('инжене́р')}</td><td>${S('инжене́р')}</td><td>engineer</td></tr>
          <tr><td>${S('программи́ст')}</td><td>${S('программи́ст')}</td><td>programmer</td></tr>
          <tr><td>${S('учи́тель')}</td><td>${S('учи́тельница')}</td><td>teacher</td></tr>
          <tr><td>${S('студе́нт')}</td><td>${S('студе́нтка')}</td><td>student</td></tr>
          <tr><td>${S('пенсионе́р')}</td><td>${S('пенсионе́рка')}</td><td>retiree</td></tr></table>
          <p>Ask: ${S('Кто он по профе́ссии?', 'What does he do?')} Two useful fixed phrases: ${S('Он рабо́тает в ба́нке.', 'He works in a bank.')} ${S('Она́ у́чится в университе́те.', 'She studies at university.')}</p>` },
        { title: 'Older and younger', html: `
          <p>${S('ста́рший брат')} elder brother · ${S('мла́дший брат')} younger brother · ${S('ста́ршая сестра́')} elder sister · ${S('мла́дшая сестра́')} younger sister.</p>
          <div class="callout"><p>Adjectives agree with the noun's gender, exactly like мой/моя: masculine <b>-ий / -ый</b>, feminine <b>-ая</b>. You will meet this pattern constantly from now on.</p></div>
          <p>Put it together: ${S('Это мой ста́рший брат. Его́ зову́т Макс. Ему́ три́дцать лет. Он программи́ст.')}</p>` },
      ],
      vocab: [
        { ru: 'врач', en: 'doctor' }, { ru: 'инжене́р', en: 'engineer' }, { ru: 'программи́ст', en: 'programmer' }, { ru: 'учи́тель', en: 'teacher (m)' }, { ru: 'учи́тельница', en: 'teacher (f)' },
        { ru: 'студе́нт', en: 'student (m)' }, { ru: 'студе́нтка', en: 'student (f)' }, { ru: 'пенсионе́р', en: 'retiree (m)' }, { ru: 'пенсионе́рка', en: 'retiree (f)' },
        { ru: 'ста́рший', en: 'elder (m)' }, { ru: 'мла́дший', en: 'younger (m)' }, { ru: 'ста́ршая', en: 'elder (f)' }, { ru: 'мла́дшая', en: 'younger (f)' },
        { ru: 'рабо́тает', en: 'works' }, { ru: 'у́чится', en: 'studies' }, { ru: 'Кто он по профе́ссии?', en: 'What does he do (for work)?' },
      ],
      exercises: [
        { type: 'mc', prompt: 'What does this mean?', big: 'Моя мама врач.', audio: 'Моя мама врач', options: ['My mom is a doctor.', 'My mom is a teacher.', 'My mom is at the doctor.', 'My mom is an engineer.'], answer: 'My mom is a doctor.' },
        { type: 'match', pairs: [['врач', 'doctor'], ['инженер', 'engineer'], ['учитель', 'teacher'], ['студент', 'student'], ['программист', 'programmer']] },
        { type: 'fill', sentence: 'Это мой ___ брат.', translation: 'This is my elder brother.', options: ['старший', 'старшая', 'младшая'], answer: 'старший' },
        { type: 'fill', sentence: 'Это моя ___ сестра.', translation: 'This is my younger sister.', options: ['младшая', 'младший', 'старший'], answer: 'младшая' },
        { type: 'tiles', prompt: 'Translate: My dad is an engineer.', answer: 'Мой папа инженер.', tiles: ['Мой', 'папа', 'инженер.', 'есть', 'моя'] },
        { type: 'mc', prompt: 'What does this mean?', big: 'Кто она по профессии?', audio: 'Кто она по профессии?', options: ['What does she do for work?', 'Who is she?', 'Where does she work?', 'Is she a professional?'], answer: 'What does she do for work?' },
        { type: 'listen_type', audio: 'врач', answer: 'врач', hint: 'doctor' },
        { type: 'mc', prompt: 'Listen. What did you hear?', audio: 'Он работает в банке', options: ['He works in a bank.', 'He studies at a bank.', 'He is a banker.', 'He lives near a bank.'], answer: 'He works in a bank.' },
        { type: 'tiles', prompt: 'Translate: She studies at university.', answer: 'Она учится в университете.', tiles: ['Она', 'учится', 'в', 'университете.', 'работает', 'Он'] },
        { type: 'mc', prompt: 'A female student is a…', options: ['студентка', 'студент', 'учительница', 'студенты'], answer: 'студентка', speakOptions: true },
        { type: 'translate', prompt: 'I am a programmer.', answer: 'Я программист', dir: 'en-ru' },
        { type: 'mc', prompt: 'What does this mean?', big: 'Моя бабушка пенсионерка.', audio: 'Моя бабушка пенсионерка', options: ['My grandmother is retired.', 'My grandmother is a teacher.', 'My grandmother is a pensioner’s wife.', 'My grandmother is at home.'], answer: 'My grandmother is retired.' },
        { type: 'speak', text: 'Мой папа инженер, а моя мама врач.', en: 'My dad is an engineer, and my mom is a doctor.' },
        { type: 'fill', sentence: 'Мой брат ___ в школе.', translation: 'My brother studies at school.', options: ['учится', 'работает', 'есть'], answer: 'учится' },
        { type: 'translate', prompt: 'Моя сестра учительница.', answer: 'my sister is a teacher', dir: 'ru-en' },
        { type: 'tiles', prompt: 'Translate: Who is this? This is my younger brother.', answer: 'Кто это? Это мой младший брат.', tiles: ['Кто', 'это?', 'Это', 'мой', 'младший', 'брат.', 'старшая'] },
        { type: 'fill', sentence: 'Моя мама ___ в банке.', translation: 'My mom works in a bank.', options: ['работает', 'учится', 'зовут'], answer: 'работает' },
      ],
      homework: { title: 'Three people, four sentences each', text: 'Describe three family members to her, four sentences each: «Это мой/моя …. Его/Её зовут …. Ему/Ей … лет. Он/Она врач.» She corrects endings. Record it on your phone and listen back. Note the sentence that was hardest.' },
    },
  ],
  test: {
    id: 'u2-test', title: 'Unit 2 test', icon: '🏆', passMark: 80,
    desc: '20 questions from all five lessons: family, “I have”, numbers, ages, plurals, professions. Pass with 80% to unlock Unit 3.',
  },
};
