import { afterEach, describe, expect, it, vi } from 'vitest';
import { products } from '../../src/data/products';
import handler from '../../netlify/functions/create-checkout-session';

const post = (body: unknown) =>
  new Request('http://localhost/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

afterEach(() => vi.unstubAllEnvs());

describe('create-checkout-session', () => {
  it('rejects non-POST requests', async () => {
    const res = await handler(new Request('http://localhost/', { method: 'GET' }));
    expect(res.status).toBe(405);
  });

  it('returns 501 when Stripe is not configured', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', '');
    const res = await handler(post({ lines: [] }));
    expect(res.status).toBe(501);
  });

  describe('with a key', () => {
    const tee = products.find((p) => p.art === 'tee')!;
    const good = { productId: tee.id, colorId: tee.colors[0].id, size: 'M', quantity: 1 };

    it.each([
      ['empty cart', { lines: [] }],
      ['unknown product', { lines: [{ ...good, productId: 'fake' }] }],
      ['bad colour', { lines: [{ ...good, colorId: 'neon' }] }],
      ['missing size', { lines: [{ ...good, size: null }] }],
      ['invalid size', { lines: [{ ...good, size: '9XL' }] }],
      ['zero quantity', { lines: [{ ...good, quantity: 0 }] }],
      ['huge quantity', { lines: [{ ...good, quantity: 500 }] }],
      ['malformed JSON', '{not json'],
    ])('rejects %s', async (_label, body) => {
      vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_dummy');
      const res = await handler(post(body));
      expect(res.status).toBe(400);
    });
  });
});
