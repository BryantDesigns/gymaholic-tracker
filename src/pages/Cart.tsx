import { Link } from 'react-router';
import { BarbellProgress } from '../components/BarbellProgress';
import { ArrowIcon, ShieldIcon } from '../components/Icons';
import { Meta } from '../components/Meta';
import { ProductArt } from '../components/ProductArt';
import { QtyStepper } from '../components/QtyStepper';
import { useCart } from '../lib/cart-context';
import { formatPrice, plural } from '../lib/format';
import { useCheckout } from '../lib/useCheckout';

export default function Cart() {
  const { lines, totals, setQty, remove } = useCart();
  const { checkout, busy, error } = useCheckout();

  return (
    <>
      <Meta title="Cart" />
      <section className="page-hero page-hero--sm">
        <div className="wrap">
          <p className="eyebrow">{plural(totals.itemCount, 'item')}</p>
          <h1 className="page-hero__title">Your cart</h1>
        </div>
      </section>

      <div className="wrap cart">
        {lines.length === 0 ? (
          <div className="empty">
            <p className="empty__title">Nothing on the bar yet.</p>
            <p className="lede">Start with a tee and work up to the belt.</p>
            <Link to="/shop" className="btn">
              Shop the drop <ArrowIcon />
            </Link>
          </div>
        ) : (
          <div className="cart__grid">
            <ul className="cart__lines">
              {lines.map((l) => (
                <li key={l.key} className="line line--lg">
                  <Link to={`/shop/${l.product.slug}`} className="line__art">
                    <ProductArt product={l.product} colorId={l.colorId} />
                  </Link>
                  <div className="line__info">
                    <Link to={`/shop/${l.product.slug}`} className="line__name">
                      {l.product.name}
                    </Link>
                    <p className="line__meta">
                      {l.colorName}
                      {l.size && ` · Size ${l.size}`} · {formatPrice(l.product.price)} each
                    </p>
                    <div className="line__row">
                      <QtyStepper
                        size="sm"
                        value={l.quantity}
                        min={0}
                        onChange={(n) => setQty(l.key, n)}
                        label={`Quantity for ${l.product.name}`}
                      />
                      <button className="line__remove" onClick={() => remove(l.key)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="line__price mono">{formatPrice(l.lineTotal)}</p>
                </li>
              ))}
            </ul>

            <aside className="summary" aria-label="Order summary">
              <h2>Order summary</h2>
              <BarbellProgress subtotal={totals.subtotal} />
              <dl className="totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd className="mono">{formatPrice(totals.subtotal)}</dd>
                </div>
                <div>
                  <dt>Shipping</dt>
                  <dd className="mono">{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd>
                </div>
                <div>
                  <dt>Tax</dt>
                  <dd className="summary__muted">Calculated at checkout</dd>
                </div>
                <div className="totals__grand">
                  <dt>Total</dt>
                  <dd className="mono">{formatPrice(totals.total)}</dd>
                </div>
              </dl>
              {error && (
                <p className="form-status" data-tone="err" role="alert">
                  {error}
                </p>
              )}
              <button className="btn btn--block" onClick={checkout} disabled={busy}>
                {busy ? 'Racking up…' : 'Secure checkout'} <ArrowIcon />
              </button>
              <p className="summary__secure">
                <ShieldIcon width={16} height={16} /> Payments processed securely by Stripe
              </p>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
