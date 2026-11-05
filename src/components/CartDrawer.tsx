import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { useCart } from '../lib/cart-context';
import { useCheckout } from '../lib/useCheckout';
import { formatPrice, plural } from '../lib/format';
import { BarbellProgress } from './BarbellProgress';
import { ArrowIcon, CloseIcon } from './Icons';
import { ProductArt } from './ProductArt';
import { QtyStepper } from './QtyStepper';

export function CartDrawer() {
  const { lines, totals, isOpen, close, setQty, remove } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  const { checkout, busy, error } = useCheckout();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    if (!isOpen && d.open) d.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-labelledby="cart-title"
      onClose={close}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="drawer__panel">
        <div className="drawer__head">
          <h2 id="cart-title">
            Your Cart <span className="mono">({totals.itemCount})</span>
          </h2>
          <button className="icon-btn" onClick={close} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        <BarbellProgress subtotal={totals.subtotal} />

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p className="drawer__empty-title">The bar is empty.</p>
            <p>Load it up. Free shipping kicks in at $75.</p>
            <Link to="/shop" className="btn" onClick={close}>
              Shop the drop <ArrowIcon />
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer__lines">
              {lines.map((l) => (
                <li key={l.key} className="line">
                  <Link to={`/shop/${l.product.slug}`} className="line__art" onClick={close}>
                    <ProductArt product={l.product} colorId={l.colorId} />
                  </Link>
                  <div className="line__info">
                    <Link to={`/shop/${l.product.slug}`} className="line__name" onClick={close}>
                      {l.product.name}
                    </Link>
                    <p className="line__meta">
                      {l.colorName}
                      {l.size && ` · ${l.size}`}
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
            <div className="drawer__foot">
              <dl className="totals">
                <div>
                  <dt>Subtotal · {plural(totals.itemCount, 'item')}</dt>
                  <dd className="mono">{formatPrice(totals.subtotal)}</dd>
                </div>
                <div>
                  <dt>Shipping</dt>
                  <dd className="mono">{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd>
                </div>
              </dl>
              {error && (
                <p className="form-status" data-tone="err" role="alert">
                  {error}
                </p>
              )}
              <button className="btn btn--block" onClick={checkout} disabled={busy}>
                {busy ? 'Racking up…' : `Checkout · ${formatPrice(totals.total)}`}
              </button>
              <Link to="/cart" className="drawer__view" onClick={close}>
                View full cart
              </Link>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
