import { describe, expect, it } from 'vitest';
import {
  dayTotals,
  emptyTracker,
  loggingStreak,
  migrateLegacy,
  shiftDateKey,
  toWhole,
  trackerReducer,
  type Meal,
} from './tracker';

const meal = (id: string, calories: number, protein = 0): Meal => ({
  id,
  name: id,
  calories,
  protein,
  loggedAt: '2026-11-05T12:00:00.000Z',
});

describe('trackerReducer', () => {
  it('adds, updates and deletes meals for a day', () => {
    let s = emptyTracker();
    s = trackerReducer(s, { type: 'addMeal', day: '2026-11-05', meal: meal('a', 500, 40) });
    s = trackerReducer(s, { type: 'addMeal', day: '2026-11-05', meal: meal('b', 300, 20) });
    expect(dayTotals(s.days['2026-11-05'])).toEqual({ calories: 800, protein: 60 });

    s = trackerReducer(s, { type: 'updateMeal', day: '2026-11-05', meal: meal('a', 600, 45) });
    expect(dayTotals(s.days['2026-11-05'])).toEqual({ calories: 900, protein: 65 });

    // Regression: the 2021 version passed `clientInformation` instead of the id here.
    s = trackerReducer(s, { type: 'deleteMeal', day: '2026-11-05', id: 'b' });
    expect(s.days['2026-11-05'].map((m) => m.id)).toEqual(['a']);
  });

  it('removes the day entirely when its last meal is deleted', () => {
    let s = trackerReducer(emptyTracker(), { type: 'addMeal', day: 'd', meal: meal('a', 1) });
    s = trackerReducer(s, { type: 'deleteMeal', day: 'd', id: 'a' });
    expect(s.days).toEqual({});
  });

  it('clears one day without touching others', () => {
    let s = trackerReducer(emptyTracker(), { type: 'addMeal', day: 'x', meal: meal('a', 1) });
    s = trackerReducer(s, { type: 'addMeal', day: 'y', meal: meal('b', 1) });
    s = trackerReducer(s, { type: 'clearDay', day: 'x' });
    expect(Object.keys(s.days)).toEqual(['y']);
  });
});

describe('dates', () => {
  it('shifts across month and year boundaries', () => {
    expect(shiftDateKey('2026-12-31', 1)).toBe('2027-01-01');
    expect(shiftDateKey('2026-03-01', -1)).toBe('2026-02-28');
  });
});

describe('loggingStreak', () => {
  it('counts consecutive days ending today', () => {
    let s = emptyTracker();
    for (const d of ['2026-11-03', '2026-11-04', '2026-11-05']) {
      s = trackerReducer(s, { type: 'addMeal', day: d, meal: meal(d, 100) });
    }
    expect(loggingStreak(s, '2026-11-05')).toBe(3);
  });

  it('still counts yesterday’s streak before today is logged', () => {
    const s = trackerReducer(emptyTracker(), { type: 'addMeal', day: '2026-11-04', meal: meal('a', 1) });
    expect(loggingStreak(s, '2026-11-05')).toBe(1);
  });

  it('is zero after a missed day', () => {
    const s = trackerReducer(emptyTracker(), { type: 'addMeal', day: '2026-11-01', meal: meal('a', 1) });
    expect(loggingStreak(s, '2026-11-05')).toBe(0);
  });
});

describe('migrateLegacy', () => {
  it('imports 2021-format items into today', () => {
    const legacy = [
      { id: 0, name: 'Steak Dinner', calories: 1200 },
      { id: 1, name: 'Pizza', calories: 1600 },
    ];
    const s = migrateLegacy(emptyTracker(), legacy, '2026-11-05');
    expect(s.days['2026-11-05']).toHaveLength(2);
    expect(dayTotals(s.days['2026-11-05']).calories).toBe(2800);
  });

  it('ignores junk', () => {
    expect(migrateLegacy(emptyTracker(), 'nope', '2026-11-05').days).toEqual({});
    expect(migrateLegacy(emptyTracker(), [{ foo: 1 }], '2026-11-05').days).toEqual({});
  });
});

describe('toWhole', () => {
  it('sanitises numeric input', () => {
    expect(toWhole('250.6')).toBe(251);
    expect(toWhole('-5')).toBe(0);
    expect(toWhole('abc')).toBe(0);
    expect(toWhole('1e9')).toBe(99999);
  });
});
