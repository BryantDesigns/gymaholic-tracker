import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { ArrowIcon } from '../components/Icons';
import { Meta } from '../components/Meta';
import { useCart } from '../lib/cart-context';
import { readJSON, writeJSON } from '../lib/storage';

const HANDLED_KEY = 'gymaholic:handled-orders';

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const { clear } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const demo = params.get('demo') === '1';
  const sessionId = params.get('session_id');
  const freshDemo = demo && (location.state as { freshOrder?: boolean } | null)?.freshOrder === true;

  // Empty the cart exactly once per completed order, so revisiting this URL
  // later (Back button, bookmark) never wipes a new cart.
  useEffect(() => {
    if (sessionId) {
      const handled = readJSON<string[]>(HANDLED_KEY, []);
      if (handled.includes(sessionId)) return;
      clear();
      writeJSON(HANDLED_KEY, [sessionId, ...handled].slice(0, 20));
    } else if (freshDemo) {
      clear();
      navigate({ search: location.search }, { replace: true, state: null });
    }
  }, [sessionId, freshDemo, clear, navigate, location.search]);

  return (
    <>
      <Meta title="Order confirmed" />
      <section className="page-hero success">
        <div className="wrap">
          <p className="eyebrow">{demo ? 'Demo checkout' : 'Order confirmed'}</p>
          <h1 className="page-hero__title">
            <span className="striped">Order</span> racked.
          </h1>
          <p className="lede">
            {demo
              ? 'This was a demo checkout, so no payment was taken. Connect Stripe to start taking real orders.'
              : 'Thanks for your order. A confirmation email with tracking details is on its way. Most orders ship within 1–2 business days.'}
          </p>
          {sessionId && <p className="mono success__ref">Ref · {sessionId.slice(-12).toUpperCase()}</p>}
          <div className="hero__ctas">
            <Link to="/fuel-log" className="btn">
              Log today's fuel <ArrowIcon />
            </Link>
            <Link to="/shop" className="btn btn--ghost">
              Keep shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
