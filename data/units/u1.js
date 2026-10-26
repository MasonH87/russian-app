// Unit 1: Greetings and introductions.
const S = (ru, en) => `<b data-say="${ru}">${ru}</b>${en ? ` <span class="muted">(${en})</span>` : ''}`;

export const U1 = {
  id: 'u1', num: 1, title: 'Hello!', ru: 'Здравствуйте!', icon: '👋',
  desc: 'Greet people the right way, ask how they are, introduce yourself, say where you are from, and meet the gender of nouns.',
  lessons: [
    /* ───────── Lesson 1 ───────── */
    {
      id: 'u1-l1', title: 'Hello and goodbye', ru: 'Привет и пока', icon: '👋',
      lecture: [
        { title: '👋 Two ways to say hello', html: `
          <p>Russian has two registers. <b>ты</b> is informal: friends, family, your girlfriend. <b>вы</b> is formal: strangers, elders, her parents, and <em>any group</em> of people.</p>
          <table><tr><th></th><th>informal (ты)</th><th>formal (вы)</th></tr>
          <tr><td>hello</td><td>${S('Привет')}</td><td>${S('Здравствуйте')}</td></tr>
          <tr><td>goodbye</td><td>${S('Пока')}</td><td>${S('До свидания')}</td></tr></table>
          <p>Time-of-day greetings work with everyone:</p>
          <ul><li>${S('Доброе утро', 'good morning')}</li><li>${S('Добрый день', 'good afternoon')}</li><li>${S('Добрый вечер', 'good evening')}</li><li>${S('Спокойной ночи', 'good night, when going to sleep')}</li></ul>
          <div class="callout"><p>Rule of thumb: when in doubt, use <b>вы</b> forms. Being too polite is never rude. Her parents get <b>Здравствуйте</b> until they tell you otherwise.</p></div>` },
        { title: 'Pronunciation notes', html: `
          <ul>
          <li>${S('Здравствуйте')}: the first <b>в</b> is silent: <em>ZDRAST-vuy-tye</em>. It is one of the hardest words you will ever learn. It only gets easier from here.</li>
          <li>${S('Пока')}: stress on the last syllable, <em>pa-KA</em>. Unstressed о sounds like а.</li>
          <li>${S('До свидания')}: <em>da svi-DA-nya</em>. Literally "until the (next) meeting".</li>
          <li>${S('Спокойной ночи')}: <em>spa-KOY-nay NO-chi</em>.</li></ul>
          <p>Tap any bold word to hear it.</p>` },
      ],
      vocab: [
        { ru: 'приве́т', en: 'hi (informal)' }, { ru: 'здра́вствуйте', en: 'hello (formal)' }, { ru: 'пока́', en: 'bye (informal)' },
        { ru: 'до свида́ния', en: 'goodbye (formal)' }, { ru: 'до́брое у́тро', en: 'good morning' }, { ru: 'до́брый день', en: 'good afternoon' },
        { ru: 'до́брый ве́чер', en: 'good evening' }, { ru: 'споко́йной но́чи', en: 'good night' }, { ru: 'да', en: 'yes' }, { ru: 'нет', en: 'no' },
      ],
      exercises: [
        { type: 'mc', prompt: 'What does this mean?', big: 'Привет', audio: 'Привет', options: ['Hi', 'Goodbye', 'Thank you', 'Yes'], answer: 'Hi' },
        { type: 'mc', prompt: 'Listen. What did you hear?', audio: 'Здравствуйте', options: ['Hello (formal)', 'Good night', 'Bye', 'No'], answer: 'Hello (formal)', explain: 'Здравствуйте: the first в is silent.' },
        { type: 'match', pairs: [['привет', 'hi'], ['пока', 'bye'], ['да', 'yes'], ['нет', 'no'], ['здравствуйте', 'hello (formal)']] },
        { type: 'mc', prompt: 'You meet your girlfriend’s mother for the first time. What do you say?', options: ['Здравствуйте', 'Привет', 'Пока', 'Нет'], answer: 'Здравствуйте', speakOptions: true, explain: 'Parents, elders and strangers get the formal вы forms.' },
        { type: 'mc', prompt: 'Which one is “good morning”?', options: ['Доброе утро', 'Добрый день', 'Добрый вечер', 'Спокойной ночи'], answer: 'Доброе утро', speakOptions: true },
        { type: 'fill', sentence: '___ вечер!', translation: 'Good evening!', options: ['Добрый', 'Доброе', 'Спокойной'], answer: 'Добрый', explain: 'вечер is masculine, so it takes добрый. утро is neuter: доброе утро.' },
        { type: 'tiles', prompt: 'Translate: Good night', answer: 'Спокойной ночи', tiles: ['Спокойной', 'ночи', 'Добрый', 'утро'] },
        { type: 'listen_type', audio: 'пока', answer: 'пока', hint: 'Short and sweet.' },
        { type: 'translate', prompt: 'Bye! (to a friend)', answer: 'пока', dir: 'en-ru' },
        { type: 'mc', prompt: 'What does this mean?', big: 'До свидания', audio: 'До свидания', options: ['Goodbye (formal)', 'Good evening', 'Hi', 'See you tomorrow'], answer: 'Goodbye (formal)' },
        { type: 'tiles', prompt: 'Translate: Hello, good afternoon!', answer: 'Здравствуйте, добрый день!', tiles: ['Здравствуйте,', 'добрый', 'день!', 'Привет', 'вечер'] },
        { type: 'speak', text: 'Привет! Добрый день!', en: 'Hi! Good afternoon!' },
        { type: 'mc', prompt: 'She asks if you want more borscht. You do not. Which word?', options: ['Нет', 'Да', 'Пока', 'Привет'], answer: 'Нет', speakOptions: true },
        { type: 'listen_type', audio: 'да', answer: 'да' },
        { type: 'translate', prompt: 'Доброе утро', answer: 'good morning', dir: 'ru-en' },
        { type: 'match', pairs: [['доброе утро', 'good morning'], ['добрый день', 'good afternoon'], ['добрый вечер', 'good evening'], ['спокойной ночи', 'good night'], ['до свидания', 'goodbye (formal)']] },
      ],
      homework: { title: 'Greet her all day', text: 'Greet your girlfriend with the right greeting for the time of day three times today (утро / день / вечер), and say «Спокойной ночи» tonight. Ask her to rate your «Здравствуйте» out of 10. Log the score in the note.' },
    },

    /* ───────── Lesson 2 ───────── */
    {
      id: 'u1-l2', title: 'How are you?', ru: 'Как дела?', icon: '🙂',
      lecture: [
        { title: '🙂 Как дела?', html: `
          <p>${S('Как дела?')} literally means "how (are) things?". It is the universal follow-up to any hello.</p>
          <table><tr><th>answer</th><th>meaning</th></tr>
          <tr><td>${S('Отлично!')}</td><td>Great!</td></tr>
          <tr><td>${S('Хорошо.')}</td><td>Good.</td></tr>
          <tr><td>${S('Нормально.')}</td><td>Okay / fine. (The most common real answer.)</td></tr>
          <tr><td>${S('Плохо.')}</td><td>Bad.</td></tr></table>
          <p>Then bounce it back: ${S('А у тебя?', 'and you? informal')} or ${S('А у вас?', 'and you? formal')}.</p>
          <div class="callout"><p>Russians answer <b>honestly</b>. "Нормально" is a perfectly good answer. "Отлично!" every day will sound suspicious.</p></div>` },
        { title: 'Please, thank you, sorry', html: `
          <ul><li>${S('Спасибо', 'thank you')}: <em>spa-SEE-ba</em>.</li>
          <li>${S('Пожалуйста')}: does double duty, <b>please</b> and <b>you're welcome</b>. <em>pa-ZHAL-sta</em>, the у is swallowed in speech.</li>
          <li>${S('Извините', 'excuse me / sorry, formal')} and ${S('Извини', 'informal')}.</li>
          <li>${S('Очень', 'very')}: ${S('очень хорошо', 'very good')}.</li></ul>` },
      ],
      vocab: [
        { ru: 'Как дела́?', en: 'How are you?' }, { ru: 'хорошо́', en: 'good, well' }, { ru: 'норма́льно', en: 'okay, fine', accept: ['normal', 'alright', 'so-so', 'ok'] },
        { ru: 'пло́хо', en: 'bad, badly' }, { ru: 'отли́чно', en: 'great, excellent' }, { ru: 'спаси́бо', en: 'thank you' },
        { ru: 'пожа́луйста', en: 'please / you’re welcome' }, { ru: 'А у тебя́?', en: 'And you? (informal)' }, { ru: 'А у вас?', en: 'And you? (formal)' },
        { ru: 'извини́те', en: 'excuse me, sorry (formal)' }, { ru: 'о́чень', en: 'very' },
      ],
      exercises: [
        { type: 'mc', prompt: 'What does this mean?', big: 'Как дела?', audio: 'Как дела?', options: ['How are you?', 'What is your name?', 'Where are you from?', 'Good night'], answer: 'How are you?' },
        { type: 'match', pairs: [['хорошо', 'good'], ['плохо', 'bad'], ['нормально', 'okay'], ['отлично', 'great'], ['спасибо', 'thank you']] },
        { type: 'tiles', prompt: 'Translate: Good, thanks. And you? (to a friend)', answer: 'Хорошо, спасибо. А у тебя?', tiles: ['Хорошо,', 'спасибо.', 'А', 'у', 'тебя?', 'вас?', 'плохо'] },
        { type: 'fill', sentence: '— Спасибо! — ___.', translation: '— Thank you! — You’re welcome.', options: ['Пожалуйста', 'Привет', 'Плохо'], answer: 'Пожалуйста', explain: 'Пожалуйста is both "please" and "you’re welcome".' },
        { type: 'listen_type', audio: 'спасибо', answer: 'спасибо' },
        { type: 'mc', prompt: 'Listen. What did you hear?', audio: 'отлично', options: ['Great', 'Bad', 'Okay', 'Please'], answer: 'Great' },
        { type: 'translate', prompt: 'Very good', answer: 'очень хорошо', dir: 'en-ru' },
        { type: 'mc', prompt: 'Her dad asks «Как дела?». You are doing well and want to ask him back politely.', options: ['Хорошо, спасибо. А у вас?', 'Хорошо, спасибо. А у тебя?', 'Плохо. А ты?', 'Пока!'], answer: 'Хорошо, спасибо. А у вас?', speakOptions: true, explain: 'Her dad gets the formal вас.' },
        { type: 'speak', text: 'Привет! Как дела?', en: 'Hi! How are you?' },
        { type: 'tiles', prompt: 'Translate: Excuse me, please.', answer: 'Извините, пожалуйста.', tiles: ['Извините,', 'пожалуйста.', 'Спасибо', 'Хорошо'] },
        { type: 'listen_type', audio: 'плохо', answer: 'плохо' },
        { type: 'translate', prompt: 'Нормально', answer: 'okay', accept: ['fine', 'normal', 'alright', 'so so', 'ok', 'not bad'], dir: 'ru-en' },
        { type: 'mc', prompt: 'Which word means BOTH “please” and “you’re welcome”?', options: ['Пожалуйста', 'Спасибо', 'Извините', 'Хорошо'], answer: 'Пожалуйста', speakOptions: true },
        { type: 'fill', sentence: 'Привет! Как ___?', translation: 'Hi! How are you?', options: ['дела', 'день', 'очень'], answer: 'дела' },
        { type: 'translate', prompt: 'Hi! How are you?', answer: 'Привет! Как дела?', dir: 'en-ru' },
        { type: 'match', pairs: [['извините', 'excuse me'], ['пожалуйста', 'please'], ['а у тебя?', 'and you?'], ['очень', 'very'], ['как дела?', 'how are you?']] },
      ],
      homework: { title: 'A full mini-dialogue', text: 'Have a complete exchange with her in Russian: greeting, «Как дела?», your answer, «А у тебя?», her answer, «Пока». Record it on your phone and listen back once. Note one sound you want to fix.' },
    },

    /* ───────── Lesson 3 ───────── */
    {
      id: 'u1-l3', title: 'What’s your name?', ru: 'Как тебя зовут?', icon: '🪪',
      lecture: [
        { title: '🪪 Names', html: `
          <p>Russians literally ask "how do they call you?":</p>
          <ul><li>${S('Как тебя зовут?', 'informal')}</li><li>${S('Как вас зовут?', 'formal')}</li>
          <li>${S('Меня зовут Мейсон.', 'My name is Mason.')}</li>
          <li>${S('Очень приятно!', 'Nice to meet you! literally "very pleasant"')}</li></ul>
          <div class="callout"><p>меня / тебя / вас are the object forms of я / ты / вы ("me / you / you"). Do not worry about <em>why</em> yet; that is the accusative case, coming in Unit 4. For now, learn the phrases whole.</p></div>` },
        { title: 'Pronouns and introducing people', html: `
          <table><tr><th>Russian</th><th>English</th></tr>
          <tr><td>${S('я')}</td><td>I</td></tr><tr><td>${S('ты')}</td><td>you (informal)</td></tr><tr><td>${S('он')}</td><td>he</td></tr>
          <tr><td>${S('она')}</td><td>she</td></tr><tr><td>${S('мы')}</td><td>we</td></tr><tr><td>${S('вы')}</td><td>you (formal / plural)</td></tr></table>
          <p>To introduce someone, point and say ${S('Это', 'this is')}: ${S('Это Анна.')} ${S('Её зовут Анна.', 'Her name is Anna.')} ${S('Его зовут Игорь.', 'His name is Igor.')}</p>
          <p>Ask who someone is: ${S('Кто это?', 'Who is this?')}</p>
          <div class="callout"><p>There is no word for "is" or "am" in the present tense. ${S('Я Мейсон.')} = "I (am) Mason." ${S('Это Анна.')} = "This (is) Anna."</p></div>` },
      ],
      vocab: [
        { ru: 'Как тебя́ зову́т?', en: 'What’s your name? (informal)' }, { ru: 'Как вас зову́т?', en: 'What’s your name? (formal)' },
        { ru: 'Меня́ зову́т…', en: 'My name is…' }, { ru: 'О́чень прия́тно', en: 'Nice to meet you' }, { ru: 'э́то', en: 'this is, this' },
        { ru: 'я', en: 'I' }, { ru: 'ты', en: 'you (informal)' }, { ru: 'вы', en: 'you (formal / plural)' }, { ru: 'он', en: 'he' }, { ru: 'она́', en: 'she' },
        { ru: 'мы', en: 'we' }, { ru: 'кто', en: 'who' }, { ru: 'его́ зову́т', en: 'his name is' }, { ru: 'её зову́т', en: 'her name is' }, { ru: 'и', en: 'and' },
      ],
      exercises: [
        { type: 'mc', prompt: 'What does this mean?', big: 'Как тебя зовут?', audio: 'Как тебя зовут?', options: ['What’s your name?', 'How are you?', 'Where are you from?', 'Who is this?'], answer: 'What’s your name?' },
        { type: 'tiles', prompt: 'Translate: My name is Mason.', answer: 'Меня зовут Мейсон.', tiles: ['Меня', 'зовут', 'Мейсон.', 'тебя', 'Как'] },
        { type: 'fill', sentence: 'Как ___ зовут?', translation: 'What is your name? (asking her mother)', options: ['вас', 'тебя', 'меня'], answer: 'вас', explain: 'Formal: вас. Informal: тебя. Меня = me.' },
        { type: 'match', pairs: [['я', 'I'], ['ты', 'you (informal)'], ['вы', 'you (formal)'], ['он', 'he'], ['она', 'she']] },
        { type: 'listen_type', audio: 'это', answer: 'это', hint: 'Starts with the plain э.' },
        { type: 'tiles', prompt: 'Translate: This is Anna.', answer: 'Это Анна.', tiles: ['Это', 'Анна.', 'она', 'зовут'] },
        { type: 'mc', prompt: 'Listen. What did you hear?', audio: 'Очень приятно', options: ['Nice to meet you', 'Very good', 'My name is', 'Who is this?'], answer: 'Nice to meet you' },
        { type: 'translate', prompt: 'Nice to meet you', answer: 'очень приятно', dir: 'en-ru' },
        { type: 'fill', sentence: '___ зовут Ольга.', translation: 'Her name is Olga.', options: ['Её', 'Его', 'Меня'], answer: 'Её' },
        { type: 'tiles', prompt: 'Translate: His name is Igor.', answer: 'Его зовут Игорь.', tiles: ['Его', 'зовут', 'Игорь.', 'Её', 'Это'] },
        { type: 'tiles', prompt: 'Translate: Who is this?', answer: 'Кто это?', tiles: ['Кто', 'это?', 'Как', 'она'] },
        { type: 'speak', text: 'Очень приятно!', en: 'Nice to meet you!' },
        { type: 'listen_type', audio: 'она', answer: 'она' },
        { type: 'mc', prompt: 'Choose the pronoun: “___ (she) Анна.”', options: ['Она', 'Он', 'Ты', 'Мы'], answer: 'Она', speakOptions: true },
        { type: 'translate', prompt: 'Как вас зовут?', answer: 'what is your name', accept: ['what\'s your name', 'what is your name (formal)', 'what are you called'], dir: 'ru-en' },
        { type: 'tiles', prompt: 'Translate: Hi! My name is Mason. And you?', answer: 'Привет! Меня зовут Мейсон. А тебя?', tiles: ['Привет!', 'Меня', 'зовут', 'Мейсон.', 'А', 'тебя?', 'вас?'] },
      ],
      homework: { title: 'Introductions from a photo', text: 'Introduce yourself to her in Russian («Привет! Меня зовут… Очень приятно!»). Then pick a family photo and have her introduce two people: «Это… Её/Его зовут…». Write both names in Cyrillic in the note.' },
    },

    /* ───────── Lesson 4 ───────── */
    {
      id: 'u1-l4', title: 'Where are you from?', ru: 'Откуда ты?', icon: '🌍',
      lecture: [
        { title: '🌍 Откуда ты?', html: `
          <p>${S('Откуда ты?', 'Where are you from? informal')} · ${S('Откуда вы?', 'formal')}</p>
          <ul><li>${S('Я из Америки.', 'I am from America.')}</li><li>${S('Она из России.', 'She is from Russia.')}</li><li>${S('Он из Канады.', 'He is from Canada.')}</li></ul>
          <div class="callout"><p>Notice the endings change after <b>из</b> (from): Аме́рика → из Аме́рик<b>и</b>, Росси́я → из Росси́<b>и</b>, Кана́да → из Кана́д<b>ы</b>. This is the genitive case. For now, learn these as fixed phrases; the system comes in Unit 6.</p></div>` },
        { title: 'Where you live, and nationality', html: `
          <p>${S('Где ты живёшь?', 'Where do you live?')} · ${S('Я живу в Бостоне.', 'I live in Boston.')} · ${S('Я живу в Москве.', 'I live in Moscow.')}</p>
          <p>After <b>в</b> (in) the ending usually becomes <b>-е</b>: Москва → в Москв<b>е</b>, Америка → в Америк<b>е</b>. (Prepositional case, Unit 4.)</p>
          <p>Nationality words change with the speaker's gender:</p>
          <table><tr><th></th><th>man</th><th>woman</th></tr>
          <tr><td>American</td><td>${S('американец')}</td><td>${S('американка')}</td></tr>
          <tr><td>Russian</td><td>${S('русский')}</td><td>${S('русская')}</td></tr></table>
          <p>${S('Я американец.')} ${S('Она русская.')}</p>` },
      ],
      vocab: [
        { ru: 'Отку́да ты?', en: 'Where are you from? (informal)' }, { ru: 'Я из Аме́рики', en: 'I am from America' }, { ru: 'Росси́я', en: 'Russia' },
        { ru: 'Аме́рика', en: 'America' }, { ru: 'из Росси́и', en: 'from Russia' }, { ru: 'америка́нец', en: 'American (man)' }, { ru: 'америка́нка', en: 'American (woman)' },
        { ru: 'ру́сский', en: 'Russian (man)' }, { ru: 'ру́сская', en: 'Russian (woman)' }, { ru: 'Я живу́ в…', en: 'I live in…' }, { ru: 'Где ты живёшь?', en: 'Where do you live?' },
        { ru: 'го́род', en: 'city' }, { ru: 'где', en: 'where' }, { ru: 'Москва́', en: 'Moscow' },
      ],
      exercises: [
        { type: 'mc', prompt: 'What does this mean?', big: 'Откуда ты?', audio: 'Откуда ты?', options: ['Where are you from?', 'Where do you live?', 'Who are you?', 'How are you?'], answer: 'Where are you from?' },
        { type: 'tiles', prompt: 'Translate: I am from America.', answer: 'Я из Америки.', tiles: ['Я', 'из', 'Америки.', 'в', 'Америка'] },
        { type: 'fill', sentence: 'Она из ___.', translation: 'She is from Russia.', options: ['России', 'Россия', 'русская'], answer: 'России', explain: 'After из the ending changes: Россия → России.' },
        { type: 'match', pairs: [['Россия', 'Russia'], ['Америка', 'America'], ['город', 'city'], ['где', 'where'], ['откуда', 'from where']] },
        { type: 'mc', prompt: 'How do you say “She is Russian”?', options: ['Она русская', 'Она русский', 'Он русская', 'Она Россия'], answer: 'Она русская', speakOptions: true, explain: 'Feminine ending -ая for a woman.' },
        { type: 'mc', prompt: 'You are a man. “I am American.”', options: ['Я американец', 'Я американка', 'Я Америка', 'Я русский'], answer: 'Я американец', speakOptions: true },
        { type: 'listen_type', audio: 'Россия', answer: 'Россия' },
        { type: 'tiles', prompt: 'Translate: I live in Moscow.', answer: 'Я живу в Москве.', tiles: ['Я', 'живу', 'в', 'Москве.', 'из', 'Москва'] },
        { type: 'translate', prompt: 'Where do you live? (informal)', answer: 'Где ты живёшь?', dir: 'en-ru' },
        { type: 'mc', prompt: 'Listen. What did you hear?', audio: 'Я из Канады', options: ['I am from Canada', 'I live in Canada', 'She is from Canada', 'I am Canadian'], answer: 'I am from Canada' },
        { type: 'fill', sentence: 'Я живу ___ Америке.', translation: 'I live in America.', options: ['в', 'из', 'и'], answer: 'в', explain: 'в = in (where you live), из = from (where you are from).' },
        { type: 'speak', text: 'Я из Америки.', en: 'I am from America.' },
        { type: 'tiles', prompt: 'Translate: Where are you from? I am from Russia.', answer: 'Откуда ты? Я из России.', tiles: ['Откуда', 'ты?', 'Я', 'из', 'России.', 'Где', 'в'] },
        { type: 'translate', prompt: 'Он американец.', answer: 'he is American', accept: ['he is an American', 'he\'s American', 'he is american man'], dir: 'ru-en' },
        { type: 'listen_type', audio: 'город', answer: 'город', hint: 'Unstressed о sounds like а, but is still written о.' },
        { type: 'match', pairs: [['американец', 'American (man)'], ['американка', 'American (woman)'], ['русский', 'Russian (man)'], ['русская', 'Russian (woman)'], ['я живу в', 'I live in']] },
      ],
      homework: { title: 'Her hometown', text: 'Ask her «Откуда ты?» and «Где ты живёшь?». Then find her home town on a map, learn to read and say its name in Cyrillic, and write it in the note. Ask her for one fact about it, in simple Russian if she can.' },
    },

    /* ───────── Lesson 5 ───────── */
    {
      id: 'u1-l5', title: 'This is my… (gender)', ru: 'Это мой, моя, моё', icon: '🏠',
      lecture: [
        { title: '🏠 Every noun has a gender', html: `
          <p>Russian nouns are masculine, feminine or neuter, and you can usually <b>see</b> it from the last letter:</p>
          <table><tr><th>ends in</th><th>gender</th><th>examples</th></tr>
          <tr><td>a consonant</td><td>masculine</td><td>${S('стол')}, ${S('дом')}, ${S('брат')}, ${S('кот')}</td></tr>
          <tr><td>-а / -я</td><td>feminine</td><td>${S('книга')}, ${S('сестра')}, ${S('кошка')}, ${S('семья')}</td></tr>
          <tr><td>-о / -е</td><td>neuter</td><td>${S('окно')}, ${S('кафе')}, ${S('утро')}</td></tr></table>
          <div class="callout"><p>Exception: words for male people are masculine whatever they end in. ${S('папа', 'dad')} and ${S('дядя', 'uncle')} are masculine.</p></div>` },
        { title: '"My" has to agree', html: `
          <p>The word for "my" changes to match the noun:</p>
          <ul><li>masculine: ${S('мой')} — ${S('Это мой брат.', 'This is my brother.')}</li>
          <li>feminine: ${S('моя')} — ${S('Это моя сестра.', 'This is my sister.')}</li>
          <li>neuter: ${S('моё')} — ${S('Это моё окно.', 'This is my window.')}</li></ul>
          <p>Pattern: ${S('Это')} + ${S('мой / моя / моё')} + noun. No word for "is". That is a complete, correct Russian sentence.</p>
          <p>Useful nouns: ${S('друг', 'friend, male')}, ${S('подруга', 'friend, female')}, ${S('собака', 'dog')}, ${S('телефон', 'phone')}.</p>` },
      ],
      vocab: [
        { ru: 'мой', en: 'my (masculine)' }, { ru: 'моя́', en: 'my (feminine)' }, { ru: 'моё', en: 'my (neuter)' },
        { ru: 'ма́ма', en: 'mom' }, { ru: 'па́па', en: 'dad' }, { ru: 'брат', en: 'brother' }, { ru: 'сестра́', en: 'sister' },
        { ru: 'друг', en: 'friend (male)' }, { ru: 'подру́га', en: 'friend (female)' }, { ru: 'кот', en: 'cat (male)' }, { ru: 'ко́шка', en: 'cat (female)' },
        { ru: 'соба́ка', en: 'dog' }, { ru: 'дом', en: 'house, home' }, { ru: 'окно́', en: 'window' }, { ru: 'кни́га', en: 'book' }, { ru: 'стол', en: 'table' }, { ru: 'телефо́н', en: 'phone' },
      ],
      exercises: [
        { type: 'mc', prompt: 'What gender is this noun?', big: 'книга', options: ['feminine', 'masculine', 'neuter'], answer: 'feminine', explain: 'Ends in -а: feminine.' },
        { type: 'mc', prompt: 'What gender is this noun?', big: 'стол', options: ['masculine', 'feminine', 'neuter'], answer: 'masculine', explain: 'Ends in a consonant: masculine.' },
        { type: 'mc', prompt: 'What gender is this noun?', big: 'окно', options: ['neuter', 'masculine', 'feminine'], answer: 'neuter', explain: 'Ends in -о: neuter.' },
        { type: 'fill', sentence: 'Это ___ сестра.', translation: 'This is my sister.', options: ['моя', 'мой', 'моё'], answer: 'моя' },
        { type: 'fill', sentence: 'Это ___ брат.', translation: 'This is my brother.', options: ['мой', 'моя', 'моё'], answer: 'мой' },
        { type: 'fill', sentence: 'Это ___ окно.', translation: 'This is my window.', options: ['моё', 'мой', 'моя'], answer: 'моё' },
        { type: 'match', pairs: [['мама', 'mom'], ['папа', 'dad'], ['брат', 'brother'], ['сестра', 'sister'], ['друг', 'friend (male)']] },
        { type: 'tiles', prompt: 'Translate: This is my friend (female).', answer: 'Это моя подруга.', tiles: ['Это', 'моя', 'подруга.', 'мой', 'друг'] },
        { type: 'mc', prompt: 'Trap question! What gender is this noun?', big: 'папа', options: ['masculine', 'feminine', 'neuter'], answer: 'masculine', explain: 'It ends in -а, but dad is a man, so it is masculine: мой папа.' },
        { type: 'listen_type', audio: 'собака', answer: 'собака' },
        { type: 'tiles', prompt: 'Translate: This is my dog.', answer: 'Это моя собака.', tiles: ['Это', 'моя', 'собака.', 'мой', 'моё'] },
        { type: 'translate', prompt: 'my cat (male)', answer: 'мой кот', dir: 'en-ru' },
        { type: 'match', pairs: [['кот', 'cat (male)'], ['кошка', 'cat (female)'], ['собака', 'dog'], ['дом', 'house'], ['окно', 'window']] },
        { type: 'mc', prompt: 'Listen. What did you hear?', audio: 'Это моя мама', options: ['This is my mom', 'This is my dad', 'This is my sister', 'This is my house'], answer: 'This is my mom' },
        { type: 'tiles', prompt: 'Translate: This is my phone and this is my book.', answer: 'Это мой телефон и это моя книга.', tiles: ['Это', 'мой', 'телефон', 'и', 'это', 'моя', 'книга.', 'моё'] },
        { type: 'speak', text: 'Это моя сестра.', en: 'This is my sister.' },
        { type: 'translate', prompt: 'Это мой дом.', answer: 'this is my house', accept: ['this is my home', 'it is my house', 'it\'s my house'], dir: 'ru-en' },
        { type: 'fill', sentence: 'Это ___ папа.', translation: 'This is my dad.', options: ['мой', 'моя', 'моё'], answer: 'мой', explain: 'папа is a man, so masculine мой.' },
      ],
      homework: { title: 'Ten things in your home', text: 'Walk around your place with her. Point at ten things and say «Это мой / моя / моё …». She corrects the gender. Write the ten words with their gender (m / f / n) in the note.' },
    },
  ],
  test: {
    id: 'u1-test', title: 'Unit 1 test', icon: '🏆', passMark: 80,
    desc: '20 questions drawn from all five lessons. Pass with 80% to unlock Unit 2.',
  },
};
