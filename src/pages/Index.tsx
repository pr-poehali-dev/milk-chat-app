import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { cows, weeklyTotals, herdEntries, noteMeta, type Cow, type NoteType } from '@/data/farm';

type Section = 'dashboard' | 'entry' | 'analytics' | 'cows';

const NAV: { id: Section; label: string; icon: string; emoji?: string }[] = [
  { id: 'dashboard', label: 'Главная', icon: 'LayoutDashboard' },
  { id: 'entry', label: 'Надой стада', icon: 'ClipboardPlus' },
  { id: 'analytics', label: 'Аналитика', icon: 'TrendingUp' },
  { id: 'cows', label: 'Коровы', icon: '', emoji: '🐄' },
];

const statusMap = {
  active: { label: 'В строю', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  rest: { label: 'Сухостой', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  sick: { label: 'На лечении', cls: 'bg-red-100 text-red-700 border-red-200' },
};

const maxYield = Math.max(...weeklyTotals.map((d) => d.value));
const todayTotal = weeklyTotals[weeklyTotals.length - 1].value;
const weekTotal = weeklyTotals.reduce((a, b) => a + b.value, 0);

const Index = () => {
  const [section, setSection] = useState<Section>('dashboard');
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="md:w-64 bg-primary text-primary-foreground flex md:flex-col shrink-0">
        <div className="px-6 py-6 flex items-center gap-3 border-b border-white/10 grow md:grow-0">
          <div className="w-10 h-10 rounded bg-accent flex items-center justify-center shrink-0">
            <Icon name="Milk" size={22} className="text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-display font-600 text-lg leading-none tracking-wide">Учёт молока</h1>
            <p className="text-xs text-white/50 mt-1">управление стадом</p>
          </div>
        </div>
        <nav className="flex md:flex-col md:p-3 md:gap-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => { setSection(n.id); setSelectedCow(null); }}
              className={`flex items-center gap-3 px-4 py-3 md:rounded-md text-sm font-500 transition-colors w-full ${
                section === n.id ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {n.emoji
                ? <span className="text-lg w-[18px] text-center leading-none">{n.emoji}</span>
                : <Icon name={n.icon} size={18} />
              }
              <span className="hidden md:inline">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="hidden md:block mt-auto p-4 text-xs text-white/40">
          {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </aside>

      <main className="flex-1 p-5 md:p-10 max-w-6xl mx-auto w-full">
        {section === 'dashboard' && <Dashboard />}
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

function Dashboard() {
  const active = cows.filter((c) => c.status === 'active').length;
  return (
    <>
      <SectionHead title="Сводка по ферме" sub="Ключевые показатели надоя по всему стаду" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="Droplets" label="Надой сегодня" value={todayTotal.toFixed(1)} unit="л" trend={2.4} />
        <StatCard icon="Beef" label="Дойное стадо" value={String(active)} unit="гол" />
        <StatCard icon="Sigma" label="Надой за неделю" value={weekTotal.toFixed(0)} unit="л" trend={4.2} />
        <StatCard icon="Percent" label="Жирность" value="3.9" unit="%" trend={-0.2} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 animate-fade-in">
          <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-6">Надой стада за неделю</h3>
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
          <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-4">Последние дойки</h3>
          <div className="space-y-3">
            {herdEntries.slice(0, 4).map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors">
                <span className="w-9 h-9 rounded bg-secondary flex items-center justify-center shrink-0">
                  <Icon name="Droplets" size={16} className="text-primary" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-500">{e.shift}</p>
                  <p className="text-xs text-muted-foreground">{e.date}</p>
                </div>
                <span className="font-display font-600 text-sm">{e.volume} л</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function ShiftBlock({
  label, icon, saved, onSave,
}: { label: string; icon: string; saved: boolean; onSave: (vol: string, cnt: string) => void }) {
  const [vol, setVol] = useState('');
  const [cnt, setCnt] = useState('');

  const handleSave = () => {
    if (!vol) return;
    onSave(vol, cnt);
  };

  return (
    <div className={`rounded-lg border-2 p-5 transition-all ${saved ? 'border-emerald-400 bg-emerald-50' : 'border-border'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name={icon} size={20} className={saved ? 'text-emerald-600' : 'text-primary'} />
          <span className="font-display font-600 text-lg uppercase tracking-wide">{label}</span>
        </div>
        {saved && (
          <span className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center animate-scale-in">
            <Icon name="Check" size={15} className="text-white" />
          </span>
        )}
      </div>
      {saved ? (
        <p className="text-sm text-emerald-700 font-500">Данные сохранены</p>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-500 text-muted-foreground">Объём, л</label>
            <Input type="number" placeholder="0.0" value={vol} onChange={(e) => setVol(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-500 text-muted-foreground">Дойных голов</label>
            <Input type="number" placeholder="5" value={cnt} onChange={(e) => setCnt(e.target.value)} className="mt-1" />
          </div>
          <Button className="w-full" onClick={handleSave}>Сохранить</Button>
        </div>
      )}
    </div>
  );
}

function Entry() {
  const today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }).slice(0, 5);
  const [entries, setEntries] = useState(herdEntries);
  const [morningDone, setMorningDone] = useState(false);
  const [eveningDone, setEveningDone] = useState(false);

  const save = (shift: 'Утро' | 'Вечер') => (vol: string, cnt: string) => {
    const newEntry = {
      id: Date.now(),
      date: today,
      shift,
      volume: parseFloat(vol),
      cows: parseInt(cnt) || 5,
    };
    setEntries((prev) => [newEntry, ...prev]);
    if (shift === 'Утро') setMorningDone(true);
    else setEveningDone(true);
  };

  return (
    <>
      <SectionHead title="Надой стада" sub="Регистрация общего объёма молока по дойкам" />
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-500 text-foreground block mb-2">Дата</label>
            <Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
          </div>
          <ShiftBlock label="Утро" icon="Sunrise" saved={morningDone} onSave={save('Утро')} />
          <ShiftBlock label="Вечер" icon="Sunset" saved={eveningDone} onSave={save('Вечер')} />
        </div>

        <Card className="lg:col-span-3 p-6 animate-fade-in">
          <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-4">Журнал доек</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Смена</TableHead>
                <TableHead className="text-right">Голов</TableHead>
                <TableHead className="text-right">Объём</TableHead>
                <TableHead className="text-right">На голову</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-500">{e.date}</TableCell>
                  <TableCell><Badge variant="secondary">{e.shift}</Badge></TableCell>
                  <TableCell className="text-right text-muted-foreground">{e.cows}</TableCell>
                  <TableCell className="text-right font-display font-600">{e.volume} л</TableCell>
                  <TableCell className="text-right text-muted-foreground">{(e.volume / e.cows).toFixed(1)} л</TableCell>
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
  const avgDay = (weekTotal / 7).toFixed(1);
  return (
    <>
      <SectionHead title="Аналитика надоев" sub="Динамика надоя по всему стаду" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="Sigma" label="Надой за неделю" value={weekTotal.toFixed(0)} unit="л" trend={4.2} />
        <StatCard icon="ChartNoAxesColumn" label="Средний за день" value={avgDay} unit="л" trend={6.8} />
        <StatCard icon="Award" label="Лучший день" value={String(maxYield)} unit="л" />
        <StatCard icon="Target" label="План выполнен" value="94" unit="%" trend={1.5} />
      </div>
      <Card className="p-6 animate-fade-in mb-6">
        <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-6">Надой стада по дням</h3>
        <div className="flex items-end justify-between gap-2 h-56">
          {weeklyTotals.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-xs font-600 text-muted-foreground">{d.value}</span>
              <div className="w-full rounded-t bg-gradient-to-t from-primary to-accent transition-all hover:opacity-80"
                style={{ height: `${(d.value / maxYield) * 100}%` }} />
              <span className="text-xs text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6 animate-fade-in">
        <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-4">Структура стада</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {(['active', 'rest', 'sick'] as const).map((s) => {
            const count = cows.filter((c) => c.status === s).length;
            return (
              <div key={s} className="p-4 rounded-md border border-border/60 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{statusMap[s].label}</p>
                  <p className="font-display font-600 text-2xl mt-1">{count} <span className="text-sm font-400 text-muted-foreground">гол</span></p>
                </div>
                <Badge variant="outline" className={statusMap[s].cls}>{Math.round((count / cows.length) * 100)}%</Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

function Cows({ selected, onSelect }: { selected: Cow | null; onSelect: (c: Cow | null) => void }) {
  if (selected) return <CowDetail cow={selected} onBack={() => onSelect(null)} />;

  return (
    <>
      <SectionHead title="Стадо" sub="Карточки коров, статусы и заметки" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cows.map((c) => {
          const st = statusMap[c.status];
          return (
            <Card key={c.id} onClick={() => onSelect(c)}
              className="p-5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all animate-scale-in border-border/60">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-md bg-secondary flex items-center justify-center text-2xl">
                  🐄
                </div>
                <Badge variant="outline" className={st.cls}>{st.label}</Badge>
              </div>
              <h3 className="font-display font-600 text-xl tracking-tight">{c.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{c.tag} · {c.breed}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon name="StickyNote" size={14} />
                {c.notes.length > 0 ? `${c.notes.length} заметок` : 'Нет заметок'}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function CowDetail({ cow, onBack }: { cow: Cow; onBack: () => void }) {
  const [notes, setNotes] = useState(cow.notes);
  const [type, setType] = useState<NoteType>('other');
  const [text, setText] = useState('');
  const st = statusMap[cow.status];

  const addNote = () => {
    if (!text.trim()) return;
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}`;
    setNotes([{ id: Date.now(), type, date, text: text.trim() }, ...notes]);
    setText('');
    setType('other');
  };

  return (
    <>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
        <Icon name="ArrowLeft" size={16} /> Назад к списку
      </button>
      <div className="flex flex-wrap items-center gap-4 mb-8 animate-fade-in">
        <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center text-4xl">
          🐄
        </div>
        <div>
          <h2 className="font-display font-600 text-3xl tracking-tight uppercase">{cow.name}</h2>
          <p className="text-muted-foreground">{cow.tag} · {cow.breed} · {cow.age} года</p>
        </div>
        <Badge variant="outline" className={`${st.cls} ml-auto`}>{st.label}</Badge>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 p-6 animate-fade-in h-fit">
          <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-5">Новая заметка</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-500 text-foreground">Тип</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {(Object.keys(noteMeta) as NoteType[]).map((t) => (
                  <button key={t} onClick={() => setType(t)}
                    className={`h-10 rounded-md border text-sm font-500 flex items-center justify-center gap-1.5 transition-colors ${
                      type === t ? 'border-accent text-accent bg-accent/5' : 'border-input hover:border-accent/50'
                    }`}>
                    <Icon name={noteMeta[t].icon} size={15} />{noteMeta[t].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-500 text-foreground">Описание</label>
              <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Что произошло..." className="mt-1.5 resize-none" />
            </div>
            <Button className="w-full" onClick={addNote}>
              <Icon name="Plus" size={18} className="mr-1" />Добавить заметку
            </Button>
          </div>
        </Card>

        <Card className="lg:col-span-3 p-6 animate-fade-in">
          <h3 className="font-display font-500 text-lg uppercase tracking-wide mb-5">История заметок</h3>
          {notes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="StickyNote" size={36} className="mx-auto mb-3 opacity-40" />
              <p>Заметок пока нет</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((n) => {
                const m = noteMeta[n.type];
                return (
                  <div key={n.id} className="flex gap-3 p-4 rounded-md border border-border/60 animate-scale-in">
                    <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                      <Icon name={m.icon} size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={m.cls}>{m.label}</Badge>
                        <span className="text-xs text-muted-foreground">{n.date}</span>
                      </div>
                      <p className="text-sm text-foreground">{n.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}



export default Index;