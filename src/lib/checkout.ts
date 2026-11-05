import type { CartLine } from './cart';

export type CheckoutResult = { kind: 'redirect'; url: string } | { kind: 'demo' };

/**
 * Ask the checkout function for a Stripe Checkout session.
 *
 * If the function isn't reachable or Stripe isn't configured, development
 * builds (or builds with VITE_DEMO_CHECKOUT=true) fall back to a demo order
 * so the flow can be tested. Production builds show an error instead, so no
 * customer ever sees a fake order confirmation.
 */
const demoAllowed = import.meta.env.DEV || import.meta.env.VITE_DEMO_CHECKOUT === 'true';

export async function startCheckout(lines: CartLine[]): Promise<CheckoutResult> {
  const unavailable = () => {
    if (demoAllowed) return { kind: 'demo' } as const;
    throw new Error('Checkout is temporarily unavailable. Please try again shortly.');
  };

  let res: Response;
  try {
    res = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lines: lines.map(({ productId, colorId, size, quantity }) => ({
          productId,
          colorId,
          size,
          quantity,
        })),
      }),
    });
  } catch {
    return unavailable();
  }

  // 404: function not running. 501: deployed without a STRIPE_SECRET_KEY.
  if (res.status === 404 || res.status === 501) return unavailable();

  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) {
    throw new Error(data.error ?? 'Checkout is unavailable right now. Please try again.');
  }
  return { kind: 'redirect', url: data.url };
}
