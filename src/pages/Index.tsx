import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { cows, weeklyTotals, recentEntries, type Cow } from '@/data/farm';

type Section = 'dashboard' | 'entry' | 'analytics' | 'cows';

const NAV: { id: Section; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Главная', icon: 'LayoutDashboard' },
  { id: 'entry', label: 'Регистрация надоя', icon: 'ClipboardPlus' },
  { id: 'analytics', label: 'Аналитика', icon: 'TrendingUp' },
  { id: 'cows', label: 'Коровы', icon: 'Beef' },
];

const statusMap = {
  active: { label: 'В строю', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  rest: { label: 'Сухостой', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  sick: { label: 'На лечении', cls: 'bg-red-100 text-red-700 border-red-200' },
};

const maxYield = Math.max(...weeklyTotals.map((d) => d.value));
const todayTotal = weeklyTotals[weeklyTotals.length - 1].value;

function Sparkline({ data, color = 'currentColor' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${30 - ((v - min) / range) * 28 - 1}`)
    .join(' ');
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-8">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5"
        vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const Index = () => {
  const [section, setSection] = useState<Section>('dashboard');
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-64 bg-primary text-primary-foreground flex md:flex-col shrink-0">
        <div className="px-6 py-6 flex items-center gap-3 border-b border-white/10 grow md:grow-0">
          <div className="w-10 h-10 rounded bg-accent flex items-center justify-center shrink-0">
            <Icon name="Milk" size={22} className="text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-display font-600 text-lg leading-none tracking-wide">МОЛОКОУЧЁТ</h1>
            <p className="text-xs text-white/50 mt-1">ферма «Рассвет»</p>
          </div>
        </div>
        <nav className="flex md:flex-col md:p-3 md:gap-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => { setSection(n.id); setSelectedCow(null); }}
              className={`flex items-center gap-3 px-4 md:px-4 py-3 md:rounded-md text-sm font-500 transition-colors w-full ${
                section === n.id ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon name={n.icon} size={18} />
              <span className="hidden md:inline">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="hidden md:block mt-auto p-4 text-xs text-white/40">
          {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-5 md:p-10 max-w-6xl mx-auto w-full">
        {section === 'dashboard' && <Dashboard onOpenCow={(c) => { setSelectedCow(c); setSection('cows'); }} />}
        {section === 'entry' && <Entry />}
        {section === 'analytics' && <Analytics />}
        {section === 'cows' && <Cows selected={selectedCow} onSelect={setSelectedCow} />}
      </main>
    </div>
  );
};

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="font-display font-600 text-3xl md:text-4xl tracking-tight text-foreground uppercase">{title}</h2>
      <p className="text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function StatCard({ icon, label, value, unit, trend }: { icon: string; label: string; value: string; unit: string; trend?: number }) {
  return (
    <Card className="p-5 animate-scale-in border-border/60">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center">
          <Icon name={icon} size={18} className="text-primary" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-600 flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            <Icon name={trend >= 0 ? 'ArrowUp' : 'ArrowDown'} size={12} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-4">{label}</p>
      <p className="font-display font-600 text-3xl text-foreground mt-1">
        {value}<span className="text-base text-muted-foreground font-400 ml-1">{unit}</span>
      </p>
    </Card>
  );
}

function Dashboard({ onOpenCow }: { onOpenCow: (c: Cow) => void }) {
  const active = cows.filter((c) => c.status === 'active').length;
  return (
    <>
      <SectionHead title="Сводка по ферме" sub="Ключевые показатели за текущий день" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="Droplets" label="Надой сегодня" value={todayTotal.toFixed(1)} unit="л" trend={2.4} />
        <StatCard icon="Beef" label="Дойное стадо" value={String(active)} unit="гол" />
        <StatCard icon="ChartNoAxesColumn" label="Средний надой" value="24.8" unit="л/гол" trend={3.1} />
        <StatCard icon="Percent" label="Жирность" value="3.9" unit="%" trend={-0.2} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 animate-fade-in">
          <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-6">Надой за неделю</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyTotals.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-xs font-600 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{d.value}</span>
                <div className="w-full rounded-t bg-gradient-to-t from-primary to-accent transition-all hover:opacity-80"
                  style={{ height: `${(d.value / maxYield) * 100}%` }} />
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 animate-fade-in">
          <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-4">Лидеры стада</h3>
          <div className="space-y-3">
            {[...cows].sort((a, b) => b.avgYield - a.avgYield).slice(0, 4).map((c, i) => (
              <button key={c.id} onClick={() => onOpenCow(c)}
                className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors text-left">
                <span className="w-6 h-6 rounded bg-secondary text-primary text-xs font-600 flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-500 truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.tag}</p>
                </div>
                <span className="font-display font-600 text-sm">{c.avgYield} л</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function Entry() {
  return (
    <>
      <SectionHead title="Регистрация надоя" sub="Внесение объёмов молока по дойкам" />
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 p-6 animate-fade-in">
          <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-5">Новая запись</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-500 text-foreground">Корова</label>
              <select className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {cows.map((c) => <option key={c.id}>{c.name} — {c.tag}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-500 text-foreground">Объём, л</label>
                <Input type="number" placeholder="0.0" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-500 text-foreground">Жирность, %</label>
                <Input type="number" placeholder="3.9" className="mt-1.5" />
              </div>
            </div>
            <div>
              <label className="text-sm font-500 text-foreground">Смена</label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {['Утро', 'День', 'Вечер'].map((s) => (
                  <button key={s} className="h-10 rounded-md border border-input text-sm font-500 hover:border-accent hover:text-accent transition-colors">{s}</button>
                ))}
              </div>
            </div>
            <Button className="w-full" size="lg">
              <Icon name="Check" size={18} className="mr-1" />Сохранить запись
            </Button>
          </div>
        </Card>

        <Card className="lg:col-span-3 p-6 animate-fade-in">
          <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-4">Последние записи</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Корова</TableHead>
                <TableHead>Смена</TableHead>
                <TableHead>Время</TableHead>
                <TableHead className="text-right">Объём</TableHead>
                <TableHead className="text-right">Жир.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEntries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-500">{e.cow}</TableCell>
                  <TableCell><Badge variant="secondary">{e.shift}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{e.time}</TableCell>
                  <TableCell className="text-right font-display font-600">{e.volume} л</TableCell>
                  <TableCell className="text-right text-muted-foreground">{e.fat}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
}

function Analytics() {
  return (
    <>
      <SectionHead title="Аналитика надоев" sub="Динамика и тенденции по стаду" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="Sigma" label="Надой за неделю" value="1051" unit="л" trend={4.2} />
        <StatCard icon="TrendingUp" label="Рост к прошлой" value="+6.8" unit="%" trend={6.8} />
        <StatCard icon="Award" label="Лучший день" value="159" unit="л" />
        <StatCard icon="Target" label="План выполнен" value="94" unit="%" trend={1.5} />
      </div>
      <Card className="p-6 animate-fade-in">
        <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-5">Тенденции по коровам</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cows.map((c) => (
            <div key={c.id} className="p-4 rounded-md border border-border/60">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-500 text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.tag}</p>
                </div>
                <span className={`text-xs font-600 flex items-center gap-0.5 ${c.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  <Icon name={c.trend >= 0 ? 'ArrowUp' : 'ArrowDown'} size={12} />
                  {Math.abs(c.trend)}%
                </span>
              </div>
              <div className={c.trend >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                <Sparkline data={c.history} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Cows({ selected, onSelect }: { selected: Cow | null; onSelect: (c: Cow | null) => void }) {
  if (selected) {
    const st = statusMap[selected.status];
    return (
      <>
        <button onClick={() => onSelect(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <Icon name="ArrowLeft" size={16} /> Назад к списку
        </button>
        <div className="flex flex-wrap items-center gap-4 mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center">
            <Icon name="Beef" size={30} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-600 text-3xl tracking-tight uppercase">{selected.name}</h2>
            <p className="text-muted-foreground">{selected.tag} · {selected.breed} · {selected.age} года</p>
          </div>
          <Badge variant="outline" className={`${st.cls} ml-auto`}>{st.label}</Badge>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon="Droplets" label="Средний надой" value={String(selected.avgYield)} unit="л" trend={selected.trend} />
          <StatCard icon="Calendar" label="За 7 дней" value={selected.history.reduce((a, b) => a + b, 0).toFixed(0)} unit="л" />
          <StatCard icon="ArrowUp" label="Максимум" value={String(Math.max(...selected.history))} unit="л" />
          <StatCard icon="ArrowDown" label="Минимум" value={String(Math.min(...selected.history))} unit="л" />
        </div>
        <Card className="p-6 animate-fade-in">
          <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-5">История надоев</h3>
          <div className={`mb-6 ${selected.trend >= 0 ? 'text-accent' : 'text-red-500'}`}>
            <Sparkline data={selected.history} />
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {selected.history.map((v, i) => {
              const m = Math.max(...selected.history);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t bg-primary/80" style={{ height: `${(v / m) * 100}%` }} />
                  <span className="text-xs text-muted-foreground">{v}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <SectionHead title="Стадо" sub="Карточки коров и показатели надоев" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cows.map((c) => {
          const st = statusMap[c.status];
          return (
            <Card key={c.id} onClick={() => onSelect(c)}
              className="p-5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all animate-scale-in border-border/60">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-md bg-secondary flex items-center justify-center">
                  <Icon name="Beef" size={22} className="text-primary" />
                </div>
                <Badge variant="outline" className={st.cls}>{st.label}</Badge>
              </div>
              <h3 className="font-display font-600 text-xl tracking-tight">{c.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{c.tag} · {c.breed}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Средний надой</p>
                  <p className="font-display font-600 text-2xl">{c.avgYield} <span className="text-sm text-muted-foreground font-400">л</span></p>
                </div>
                <div className={`w-20 ${c.trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  <Sparkline data={c.history} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export default Index;
