export interface Cow {
  id: number;
  name: string;
  tag: string;
  breed: string;
  age: number;
  status: 'active' | 'rest' | 'sick';
  avgYield: number;
  trend: number;
  history: number[];
}

export const cows: Cow[] = [
  { id: 1, name: 'Зорька', tag: 'RU-0142', breed: 'Голштинская', age: 4, status: 'active', avgYield: 28.4, trend: 5.2, history: [24, 25, 26, 25, 27, 28, 28.4] },
  { id: 2, name: 'Бурёнка', tag: 'RU-0156', breed: 'Чёрно-пёстрая', age: 6, status: 'active', avgYield: 31.2, trend: 2.1, history: [29, 30, 30, 31, 30, 31, 31.2] },
  { id: 3, name: 'Ночка', tag: 'RU-0178', breed: 'Голштинская', age: 3, status: 'active', avgYield: 26.8, trend: 8.4, history: [21, 22, 24, 25, 25, 26, 26.8] },
  { id: 4, name: 'Малышка', tag: 'RU-0191', breed: 'Симментальская', age: 5, status: 'rest', avgYield: 18.5, trend: -12.3, history: [25, 24, 22, 21, 20, 19, 18.5] },
  { id: 5, name: 'Звёздочка', tag: 'RU-0203', breed: 'Чёрно-пёстрая', age: 4, status: 'active', avgYield: 29.6, trend: 3.8, history: [27, 28, 28, 29, 29, 29, 29.6] },
  { id: 6, name: 'Ромашка', tag: 'RU-0218', breed: 'Симментальская', age: 7, status: 'sick', avgYield: 14.2, trend: -18.7, history: [22, 21, 19, 18, 16, 15, 14.2] },
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

export const recentEntries = [
  { id: 1, cow: 'Бурёнка', time: '06:30', shift: 'Утро', volume: 16.4, fat: 3.9 },
  { id: 2, cow: 'Звёздочка', time: '06:35', shift: 'Утро', volume: 15.2, fat: 4.1 },
  { id: 3, cow: 'Зорька', time: '06:41', shift: 'Утро', volume: 14.8, fat: 3.8 },
  { id: 4, cow: 'Ночка', time: '06:47', shift: 'Утро', volume: 13.6, fat: 4.0 },
];
