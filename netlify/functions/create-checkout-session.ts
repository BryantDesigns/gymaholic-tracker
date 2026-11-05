import Stripe from 'stripe';
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD, getProductById } from '../../src/data/products';
import { MAX_QTY } from '../../src/lib/cart';

/**
 * POST /.netlify/functions/create-checkout-session
 * Body: { lines: { productId, colorId, size, quantity }[] }
 *
 * Prices are always looked up from the catalog on the server, so nothing the
 * browser sends can change what a customer is charged.
 */

interface IncomingLine {
  productId?: unknown;
  colorId?: unknown;
  size?: unknown;
  quantity?: unknown;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return json(501, { error: 'Checkout is not configured yet.' });

  let payload: { lines?: IncomingLine[] };
  try {
    payload = (await req.json()) as { lines?: IncomingLine[] };
  } catch {
    return json(400, { error: 'Invalid request body.' });
  }

  const incoming = Array.isArray(payload.lines) ? payload.lines.slice(0, 50) : [];
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;

  for (const raw of incoming) {
    const product = typeof raw.productId === 'string' ? getProductById(raw.productId) : undefined;
    if (!product) return json(400, { error: 'One of the items in your cart is no longer available.' });

    const color = product.colors.find((c) => c.id === raw.colorId);
    if (!color) return json(400, { error: `Please re-select a colour for ${product.name}.` });

    const needsSize = product.sizes.length > 0;
    const size = typeof raw.size === 'string' ? raw.size : null;
    if (needsSize && (!size || !product.sizes.includes(size))) {
      return json(400, { error: `Please re-select a size for ${product.name}.` });
    }

    const quantity = Math.floor(Number(raw.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QTY) {
      return json(400, { error: 'Invalid quantity.' });
    }

    subtotal += product.price * quantity;
    lineItems.push({
      quantity,
      price_data: {
        currency: 'usd',
        unit_amount: product.price,
        product_data: {
          name: product.name,
          description: [color.name, needsSize ? `Size ${size}` : null].filter(Boolean).join(' · '),
          metadata: { productId: product.id, colorId: color.id, size: size ?? '' },
        },
      },
    });
  }

  if (lineItems.length === 0) return json(400, { error: 'Your cart is empty.' });

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const origin =
    process.env.SITE_URL || process.env.URL || req.headers.get('origin') || 'http://localhost:8888';

  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ['US'] },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: shipping === 0 ? 'Free shipping' : 'Standard shipping',
            type: 'fixed_amount',
            fixed_amount: { amount: shipping, currency: 'usd' },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === 'true' },
      allow_promotion_codes: true,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });
    return json(200, { url: session.url });
  } catch (err) {
    console.error('Stripe checkout error', err);
    return json(502, { error: 'Payment provider error. Please try again.' });
  }
};
