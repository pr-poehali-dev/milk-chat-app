export type NoteType = 'calving' | 'illness' | 'insemination' | 'other';

export interface CowNote {
  id: number;
  type: NoteType;
  date: string;
  text: string;
}

export interface Cow {
  id: number;
  name: string;
  tag: string;
  breed: string;
  age: number;
  status: 'active' | 'rest' | 'sick';
  notes: CowNote[];
}

export const noteMeta: Record<NoteType, { label: string; icon: string; cls: string }> = {
  calving: { label: 'Отёл', icon: 'Baby', cls: 'bg-sky-100 text-sky-700 border-sky-200' },
  illness: { label: 'Болезнь', icon: 'Stethoscope', cls: 'bg-red-100 text-red-700 border-red-200' },
  insemination: { label: 'Осеменение', icon: 'HeartPulse', cls: 'bg-violet-100 text-violet-700 border-violet-200' },
  other: { label: 'Заметка', icon: 'StickyNote', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export const cows: Cow[] = [
  { id: 1, name: 'Зорька', tag: 'RU-0142', breed: 'Голштинская', age: 4, status: 'active', notes: [
    { id: 1, type: 'calving', date: '2026-03-12', text: 'Отёл прошёл нормально, тёлочка 34 кг.' },
    { id: 2, type: 'insemination', date: '2026-01-04', text: 'Искусственное осеменение, бык Гранит.' },
  ] },
  { id: 2, name: 'Бурёнка', tag: 'RU-0156', breed: 'Чёрно-пёстрая', age: 6, status: 'active', notes: [
    { id: 1, type: 'other', date: '2026-05-20', text: 'Высокая продуктивность, перевести на усиленный рацион.' },
  ] },
  { id: 3, name: 'Ночка', tag: 'RU-0178', breed: 'Голштинская', age: 3, status: 'active', notes: [
    { id: 1, type: 'insemination', date: '2026-04-18', text: 'Осеменение, ожидаемый отёл — январь.' },
  ] },
  { id: 4, name: 'Малышка', tag: 'RU-0191', breed: 'Симментальская', age: 5, status: 'rest', notes: [
    { id: 1, type: 'calving', date: '2026-06-01', text: 'Запуск перед отёлом, сухостойный период.' },
  ] },
  { id: 5, name: 'Звёздочка', tag: 'RU-0203', breed: 'Чёрно-пёстрая', age: 4, status: 'active', notes: [] },
  { id: 6, name: 'Ромашка', tag: 'RU-0218', breed: 'Симментальская', age: 7, status: 'sick', notes: [
    { id: 1, type: 'illness', date: '2026-06-22', text: 'Мастит, начато лечение антибиотиками.' },
    { id: 2, type: 'illness', date: '2026-06-25', text: 'Контрольный осмотр, динамика положительная.' },
  ] },
];

export interface HerdEntry {
  id: number;
  date: string;
  shift: 'Утро' | 'Вечер';
  volume: number;
  cows: number;
}

export const herdEntries: HerdEntry[] = [
  { id: 1, date: '28.06', shift: 'Утро', volume: 58.4, cows: 5 },
  { id: 2, date: '27.06', shift: 'Вечер', volume: 52.1, cows: 5 },
  { id: 3, date: '27.06', shift: 'Утро', volume: 57.9, cows: 5 },
  { id: 4, date: '26.06', shift: 'Вечер', volume: 51.6, cows: 5 },
  { id: 5, date: '26.06', shift: 'Утро', volume: 59.2, cows: 5 },
];

export const weeklyTotals = [
  { day: 'Пн', value: 142 },
  { day: 'Вт', value: 148 },
  { day: 'Ср', value: 151 },
  { day: 'Чт', value: 147 },
  { day: 'Пт', value: 156 },
  { day: 'Сб', value: 159 },
  { day: 'Вс', value: 148.7 },
];