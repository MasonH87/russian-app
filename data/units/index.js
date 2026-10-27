// Course outline. Units with `planned: true` are shown on the map as upcoming.
import { U0 } from './u0.js';
import { U1 } from './u1.js';
import { U2 } from './u2.js';

export const UNITS = [
  U0,
  U1,
  U2,
  { id: 'u3', num: 3, planned: true, title: 'Verbs: present tense', ru: 'Глаголы', icon: '🏃', desc: 'Я живу, ты говоришь, мы любим. Daily routine and questions.' },  { id: 'u4', num: 4, planned: true, title: 'Where? Two cases', ru: 'Где? Куда?', icon: '📍', desc: 'Prepositional (в Москве) and accusative (я люблю Россию).' },
  { id: 'u5', num: 5, planned: true, title: 'Food and ordering', ru: 'Еда', icon: '🍲', desc: 'In a cafe, at her parents’ table, likes and dislikes.' },
  { id: 'u6', num: 6, planned: true, title: 'Past tense, genitive, dates', ru: 'Вчера', icon: '📅', desc: 'What you did yesterday, “I don’t have”, days and months.' },
  { id: 'u7', num: 7, planned: true, title: 'Mock TORFL Elementary', ru: 'ТРКИ-Элементарный', icon: '🎓', desc: 'Full mock exam in the official five-part format.' },
];
