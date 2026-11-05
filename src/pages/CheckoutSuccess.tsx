import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowIcon } from '../components/Icons';
import { Meta } from '../components/Meta';
import { useCart } from '../lib/cart-context';

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const { clear } = useCart();
  const demo = params.get('demo') === '1';
  const sessionId = params.get('session_id');

  useEffect(() => {
    clear();
  }, [clear]);

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
