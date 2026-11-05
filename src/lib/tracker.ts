/**
 * Fuel Log: the original Gymaholic meal & calorie tracker, rebuilt.
 * Pure state logic lives here so it can be unit tested.
 */

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  /** ISO timestamp the meal was logged. */
  loggedAt: string;
}

export interface Goals {
  calories: number;
  protein: number;
}

export interface TrackerState {
  version: 2;
  goals: Goals;
  /** Meals keyed by local date, YYYY-MM-DD. */
  days: Record<string, Meal[]>;
}

export const DEFAULT_GOALS: Goals = { calories: 2500, protein: 180 };

export const emptyTracker = (): TrackerState => ({ version: 2, goals: DEFAULT_GOALS, days: {} });

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function shiftDateKey(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number);
  return dateKey(new Date(y, m - 1, d + days));
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export type TrackerAction =
  | { type: 'addMeal'; day: string; meal: Meal }
  | { type: 'updateMeal'; day: string; meal: Meal }
  | { type: 'deleteMeal'; day: string; id: string }
  | { type: 'clearDay'; day: string }
  | { type: 'setGoals'; goals: Goals };

export function trackerReducer(state: TrackerState, action: TrackerAction): TrackerState {
  switch (action.type) {
    case 'addMeal':
      return {
        ...state,
        days: { ...state.days, [action.day]: [...(state.days[action.day] ?? []), action.meal] },
      };
    case 'updateMeal':
      return {
        ...state,
        days: {
          ...state.days,
          [action.day]: (state.days[action.day] ?? []).map((m) =>
            m.id === action.meal.id ? action.meal : m,
          ),
        },
      };
    case 'deleteMeal': {
      const remaining = (state.days[action.day] ?? []).filter((m) => m.id !== action.id);
      const days = { ...state.days };
      if (remaining.length) days[action.day] = remaining;
      else delete days[action.day];
      return { ...state, days };
    }
    case 'clearDay': {
      const days = { ...state.days };
      delete days[action.day];
      return { ...state, days };
    }
    case 'setGoals':
      return { ...state, goals: action.goals };
  }
}

export function dayTotals(meals: Meal[]): { calories: number; protein: number } {
  return meals.reduce(
    (t, m) => ({ calories: t.calories + m.calories, protein: t.protein + m.protein }),
    { calories: 0, protein: 0 },
  );
}

/** Number of consecutive days, ending today or yesterday, with at least one meal logged. */
export function loggingStreak(state: TrackerState, today: string): number {
  let cursor = state.days[today]?.length ? today : shiftDateKey(today, -1);
  let streak = 0;
  while (state.days[cursor]?.length) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }
  return streak;
}

/** Strip anything that isn't a finite, non-negative whole number. */
export function toWhole(value: string | number, max = 99999): number {
  const n = typeof value === 'number' ? value : Number.parseFloat(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(max, Math.round(n));
}

interface LegacyItem {
  id: number;
  name: string;
  calories: number;
}

/**
 * The 2021 version stored `{ id, name, calories }[]` under the `items` key.
 * Fold those meals into today's log so returning users keep their data.
 */
export function migrateLegacy(state: TrackerState, legacy: unknown, today: string): TrackerState {
  if (!Array.isArray(legacy) || legacy.length === 0) return state;
  const meals: Meal[] = (legacy as LegacyItem[])
    .filter((i) => i && typeof i.name === 'string')
    .map((i, idx) => ({
      id: `legacy-${i.id ?? idx}`,
      name: i.name.slice(0, 80),
      calories: toWhole(i.calories),
      protein: 0,
      loggedAt: new Date().toISOString(),
    }));
  if (!meals.length) return state;
  return {
    ...state,
    days: { ...state.days, [today]: [...(state.days[today] ?? []), ...meals] },
  };
}

export function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
