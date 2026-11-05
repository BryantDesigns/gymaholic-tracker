import { describe, expect, it } from 'vitest';
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD, products } from '../data/products';
import { cartReducer, cartTotals, lineKey, MAX_QTY, resolveLines, type CartLine } from './cart';

const tee = products.find((p) => p.art === 'tee')!;
const shaker = products.find((p) => p.art === 'shaker')!;

const teeLine: CartLine = { productId: tee.id, colorId: tee.colors[0].id, size: 'M', quantity: 1 };
const shakerLine: CartLine = { productId: shaker.id, colorId: shaker.colors[0].id, size: null, quantity: 2 };

describe('cartReducer', () => {
  it('adds new lines and merges identical variants', () => {
    let s = cartReducer([], { type: 'add', line: teeLine });
    s = cartReducer(s, { type: 'add', line: teeLine });
    expect(s).toHaveLength(1);
    expect(s[0].quantity).toBe(2);
  });

  it('keeps different sizes as separate lines', () => {
    let s = cartReducer([], { type: 'add', line: teeLine });
    s = cartReducer(s, { type: 'add', line: { ...teeLine, size: 'L' } });
    expect(s).toHaveLength(2);
  });

  it('clamps quantity to MAX_QTY', () => {
    const s = cartReducer([], { type: 'add', line: { ...teeLine, quantity: 99 } });
    expect(s[0].quantity).toBe(MAX_QTY);
  });

  it('removes a line when quantity is set to 0', () => {
    const s = cartReducer([teeLine], { type: 'setQty', key: lineKey(teeLine), quantity: 0 });
    expect(s).toEqual([]);
  });

  it('clears the cart', () => {
    expect(cartReducer([teeLine, shakerLine], { type: 'clear' })).toEqual([]);
  });
});

describe('resolveLines', () => {
  it('drops unknown products, colours and sizes', () => {
    const lines = resolveLines([
      teeLine,
      { ...teeLine, productId: 'nope' },
      { ...teeLine, colorId: 'neon' },
      { ...teeLine, size: '5XL' },
      { ...teeLine, size: null },
    ]);
    expect(lines).toHaveLength(1);
    expect(lines[0].lineTotal).toBe(tee.price);
  });
});

describe('cartTotals', () => {
  it('charges flat shipping below the threshold', () => {
    const t = cartTotals(resolveLines([teeLine]));
    expect(t.shipping).toBe(FLAT_SHIPPING);
    expect(t.total).toBe(tee.price + FLAT_SHIPPING);
    expect(t.toFreeShipping).toBe(FREE_SHIPPING_THRESHOLD - tee.price);
  });

  it('ships free at or above the threshold', () => {
    const qty = Math.ceil(FREE_SHIPPING_THRESHOLD / tee.price);
    const t = cartTotals(resolveLines([{ ...teeLine, quantity: qty }]));
    expect(t.shipping).toBe(0);
    expect(t.toFreeShipping).toBe(0);
  });

  it('charges nothing for an empty cart', () => {
    expect(cartTotals([])).toMatchObject({ subtotal: 0, shipping: 0, total: 0, itemCount: 0 });
  });
});

describe('catalog', () => {
  it('has unique ids and slugs, positive prices and at least one colour', () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    for (const p of products) {
      expect(p.price).toBeGreaterThan(0);
      expect(Number.isInteger(p.price)).toBe(true);
      expect(p.colors.length).toBeGreaterThan(0);
    }
  });
});
