import { useEffect, useMemo, useReducer, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { ChevronIcon, EditIcon, TrashIcon } from '../components/Icons';
import { Meta } from '../components/Meta';
import { ProductArt } from '../components/ProductArt';
import { getProductBySlug } from '../data/products';
import { readJSON, removeKey, writeJSON } from '../lib/storage';
import {
  dateKey,
  dayTotals,
  emptyTracker,
  loggingStreak,
  migrateLegacy,
  newId,
  parseDateKey,
  shiftDateKey,
  toWhole,
  trackerReducer,
  type Meal,
  type TrackerState,
} from '../lib/tracker';

const STORAGE_KEY = 'gymaholic:fuel-log:v2';
const LEGACY_KEY = 'items';

const PRESETS: Omit<Meal, 'id' | 'loggedAt'>[] = [
  { name: 'Protein shake', calories: 160, protein: 30 },
  { name: '3 whole eggs', calories: 215, protein: 19 },
  { name: 'Chicken & rice', calories: 560, protein: 48 },
  { name: 'Greek yogurt', calories: 150, protein: 17 },
  { name: 'Overnight oats', calories: 420, protein: 24 },
  { name: 'Steak dinner', calories: 780, protein: 62 },
];

function init(): TrackerState {
  const stored = readJSON<TrackerState | null>(STORAGE_KEY, null);
  let state = stored?.version === 2 ? stored : emptyTracker();
  const legacy = readJSON<unknown>(LEGACY_KEY, null);
  if (legacy) {
    state = migrateLegacy(state, legacy, dateKey(new Date()));
    writeJSON(STORAGE_KEY, state);
    removeKey(LEGACY_KEY);
  }
  return state;
}

const fmt = new Intl.NumberFormat('en-US');
const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

function dayLabel(key: string, today: string) {
  if (key === today) return 'Today';
  if (key === shiftDateKey(today, -1)) return 'Yesterday';
  return parseDateKey(key).toLocaleDateString('en-US', { weekday: 'long' });
}

export default function FuelLog() {
  const [state, dispatch] = useReducer(trackerReducer, undefined, init);
  const today = dateKey(new Date());
  const [day, setDay] = useState(today);
  const [editing, setEditing] = useState<Meal | null>(null);
  const [form, setForm] = useState({ name: '', calories: '', protein: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => writeJSON(STORAGE_KEY, state), [state]);

  const meals = useMemo(() => state.days[day] ?? [], [state.days, day]);
  const totals = dayTotals(meals);
  const { goals } = state;
  const calPct = goals.calories ? Math.min(100, (totals.calories / goals.calories) * 100) : 0;
  const proPct = goals.protein ? Math.min(100, (totals.protein / goals.protein) * 100) : 0;
  const remaining = goals.calories - totals.calories;
  const streak = loggingStreak(state, today);

  const week = Array.from({ length: 7 }, (_, i) => {
    const k = shiftDateKey(today, i - 6);
    return { key: k, ...dayTotals(state.days[k] ?? []) };
  });
  const weekMax = Math.max(goals.calories * 1.2, ...week.map((w) => w.calories), 1);

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', calories: '', protein: '' });
    setFormError(null);
  };

  const switchDay = (k: string) => {
    setDay(k);
    resetForm();
    setConfirmClear(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setFormError('Give the meal a name.');
      nameRef.current?.focus();
      return;
    }
    if (form.calories === '') {
      setFormError('Add the calories, even a rough guess.');
      return;
    }
    const meal: Meal = {
      id: editing?.id ?? newId(),
      name: name.slice(0, 80),
      calories: toWhole(form.calories),
      protein: toWhole(form.protein, 999),
      loggedAt: editing?.loggedAt ?? new Date().toISOString(),
    };
    dispatch(editing ? { type: 'updateMeal', day, meal } : { type: 'addMeal', day, meal });
    resetForm();
    nameRef.current?.focus();
  };

  const quickAdd = (p: (typeof PRESETS)[number]) =>
    dispatch({ type: 'addMeal', day, meal: { ...p, id: newId(), loggedAt: new Date().toISOString() } });

  const startEdit = (m: Meal) => {
    setEditing(m);
    setForm({ name: m.name, calories: String(m.calories), protein: m.protein ? String(m.protein) : '' });
    setFormError(null);
    nameRef.current?.focus();
  };

  const shaker = getProductBySlug('bronze-bar-shaker');

  return (
    <>
      <Meta
        title="Fuel Log: Free Meal, Calorie & Protein Tracker"
        description="A free, private meal tracker for lifters. Log calories and protein, set daily goals and keep your streak alive. No account needed."
      />
      <section className="page-hero page-hero--sm fuel-hero">
        <div className="wrap fuel-hero__inner">
          <div>
            <p className="eyebrow">Free Tool · No Account</p>
            <h1 className="page-hero__title">
              Fuel <span className="striped">Log</span>
            </h1>
          </div>
          <p className="lede">
            Log meals, hit your protein and keep your streak going. Everything is saved in this browser
            and never leaves your device.
          </p>
        </div>
      </section>

      <div className="wrap fuel">
        <div className="daynav">
          <button className="icon-btn" onClick={() => switchDay(shiftDateKey(day, -1))} aria-label="Previous day">
            <ChevronIcon style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div className="daynav__label">
            <strong>{dayLabel(day, today)}</strong>
            <span className="mono">
              {parseDateKey(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <button
            className="icon-btn"
            onClick={() => switchDay(shiftDateKey(day, 1))}
            disabled={day >= today}
            aria-label="Next day"
          >
            <ChevronIcon />
          </button>
          {day !== today && (
            <button className="text-btn daynav__today" onClick={() => switchDay(today)}>
              Jump to today
            </button>
          )}
        </div>

        <div className="fuel__grid">
          {/* ---- Summary ---- */}
          <section className="panel fuel__summary" aria-label="Daily totals">
            <div className="ring" data-over={remaining < 0 || undefined}>
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="52" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  pathLength="100"
                  strokeDasharray={`${calPct} 100`}
                  opacity={calPct > 0 ? 1 : 0}
                />
              </svg>
              <div className="ring__center">
                <span className="ring__value mono">{fmt.format(totals.calories)}</span>
                <span className="ring__unit">of {fmt.format(goals.calories)} kcal</span>
              </div>
            </div>
            <p className="fuel__remaining">
              {remaining >= 0 ? (
                <>
                  <strong className="mono">{fmt.format(remaining)}</strong> kcal left
                </>
              ) : (
                <>
                  <strong className="mono">{fmt.format(-remaining)}</strong> kcal over. Bulking season?
                </>
              )}
            </p>

            <div className="meter">
              <div className="meter__row">
                <span>Protein</span>
                <span className="mono">
                  {totals.protein} / {goals.protein} g
                </span>
              </div>
              <div className="meter__track">
                <i style={{ width: `${proPct}%` }} />
              </div>
            </div>

            <dl className="fuel__stats">
              <div>
                <dt>Meals</dt>
                <dd className="mono">{meals.length}</dd>
              </div>
              <div>
                <dt>Streak</dt>
                <dd className="mono">
                  {streak}
                  <small>d</small>
                </dd>
              </div>
              <div>
                <dt>Protein hit</dt>
                <dd className="mono">{Math.round(proPct)}%</dd>
              </div>
            </dl>

            <div className="week" aria-label="Calories, last 7 days">
              <p className="label">Last 7 days</p>
              <div className="week__bars">
                <span
                  className="week__goal"
                  style={{ '--r': goals.calories / weekMax } as React.CSSProperties}
                  aria-hidden="true"
                />
                {week.map((w) => (
                  <button
                    key={w.key}
                    className="week__bar"
                    data-active={w.key === day || undefined}
                    onClick={() => switchDay(w.key)}
                    aria-label={`${dayLabel(w.key, today)}: ${fmt.format(w.calories)} kcal`}
                  >
                    <i style={{ height: `${(w.calories / weekMax) * 100}%` }} />
                    <span>{parseDateKey(w.key).toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ---- Form + list ---- */}
          <section className="fuel__main">
            <form className="panel meal-form" onSubmit={onSubmit} noValidate>
              <h2 className="panel__title">{editing ? 'Edit meal' : 'Add a meal'}</h2>
              <div className="meal-form__fields">
                <div className="field meal-form__name">
                  <label htmlFor="meal-name">Meal</label>
                  <input
                    ref={nameRef}
                    id="meal-name"
                    className="input"
                    placeholder="e.g. Chicken burrito bowl"
                    value={form.name}
                    maxLength={80}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="meal-cal">Calories</label>
                  <input
                    id="meal-cal"
                    className="input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="kcal"
                    value={form.calories}
                    onChange={(e) => setForm({ ...form, calories: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="meal-pro">Protein</label>
                  <input
                    id="meal-pro"
                    className="input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="grams"
                    value={form.protein}
                    onChange={(e) => setForm({ ...form, protein: e.target.value })}
                  />
                </div>
              </div>
              {formError && (
                <p className="form-status" data-tone="err" role="alert">
                  {formError}
                </p>
              )}
              <div className="meal-form__actions">
                <button className="btn" type="submit">
                  {editing ? 'Update meal' : 'Log meal'}
                </button>
                {editing && (
                  <>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => {
                        dispatch({ type: 'deleteMeal', day, id: editing.id });
                        resetForm();
                      }}
                    >
                      Delete
                    </button>
                    <button type="button" className="text-btn" onClick={resetForm}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
              {!editing && (
                <div className="presets">
                  <p className="label">Quick add</p>
                  <div className="presets__list">
                    {PRESETS.map((p) => (
                      <button type="button" key={p.name} className="preset" onClick={() => quickAdd(p)}>
                        <span>{p.name}</span>
                        <span className="mono">
                          {p.calories} · {p.protein}g
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>

            <div className="panel">
              <div className="panel__head">
                <h2 className="panel__title">{dayLabel(day, today)}'s meals</h2>
                {meals.length > 0 &&
                  (confirmClear ? (
                    <span className="confirm">
                      Clear all?
                      <button
                        className="text-btn text-btn--danger"
                        onClick={() => {
                          dispatch({ type: 'clearDay', day });
                          setConfirmClear(false);
                          resetForm();
                        }}
                      >
                        Yes, clear
                      </button>
                      <button className="text-btn" onClick={() => setConfirmClear(false)}>
                        No
                      </button>
                    </span>
                  ) : (
                    <button className="text-btn" onClick={() => setConfirmClear(true)}>
                      Clear day
                    </button>
                  ))}
              </div>
              {meals.length === 0 ? (
                <p className="meals__empty">
                  Nothing logged {day === today ? 'yet today' : 'on this day'}. Your first meal is the
                  first rep.
                </p>
              ) : (
                <ul className="meals">
                  {meals.map((m) => (
                    <li key={m.id} className="meal" data-editing={editing?.id === m.id || undefined}>
                      <div>
                        <p className="meal__name">{m.name}</p>
                        <p className="meal__time mono">{timeFmt.format(new Date(m.loggedAt))}</p>
                      </div>
                      <p className="meal__nums mono">
                        <span>{fmt.format(m.calories)} kcal</span>
                        <span>{m.protein} g</span>
                      </p>
                      <div className="meal__actions">
                        <button className="icon-btn" onClick={() => startEdit(m)} aria-label={`Edit ${m.name}`}>
                          <EditIcon width={18} height={18} />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => {
                            dispatch({ type: 'deleteMeal', day, id: m.id });
                            if (editing?.id === m.id) resetForm();
                          }}
                          aria-label={`Delete ${m.name}`}
                        >
                          <TrashIcon width={18} height={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <GoalsPanel
              goals={state.goals}
              onSave={(g) => dispatch({ type: 'setGoals', goals: g })}
            />

            {shaker && (
              <Link to={`/shop/${shaker.slug}`} className="plug">
                <ProductArt product={shaker} className="plug__art" />
                <div>
                  <p className="eyebrow">Hit your protein</p>
                  <p className="plug__title">{shaker.name}</p>
                  <p className="plug__copy">Leak-proof, so it won't leak in your bag on the way to the gym.</p>
                </div>
              </Link>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function GoalsPanel({
  goals,
  onSave,
}: {
  goals: TrackerState['goals'];
  onSave: (g: TrackerState['goals']) => void;
}) {
  const [cal, setCal] = useState(String(goals.calories));
  const [pro, setPro] = useState(String(goals.protein));
  const [saved, setSaved] = useState(false);

  return (
    <details className="panel acc acc--panel">
      <summary>Daily goals</summary>
      <form
        className="goals"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ calories: toWhole(cal) || 2500, protein: toWhole(pro, 999) || 150 });
          setSaved(true);
        }}
      >
        <div className="field">
          <label htmlFor="goal-cal">Calories / day</label>
          <input id="goal-cal" className="input" type="number" min={0} value={cal} onChange={(e) => { setCal(e.target.value); setSaved(false); }} />
        </div>
        <div className="field">
          <label htmlFor="goal-pro">Protein (g) / day</label>
          <input id="goal-pro" className="input" type="number" min={0} value={pro} onChange={(e) => { setPro(e.target.value); setSaved(false); }} />
        </div>
        <button className="btn btn--sm" type="submit">
          Save goals
        </button>
        <p className="form-note">
          Rule of thumb: 0.7–1 g of protein per pound of bodyweight.{' '}
          {saved && <span className="form-status" data-tone="ok">Saved.</span>}
        </p>
      </form>
    </details>
  );
}
