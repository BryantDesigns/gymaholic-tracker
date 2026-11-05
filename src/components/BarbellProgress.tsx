import { FREE_SHIPPING_THRESHOLD } from '../data/products';
import { formatPrice } from '../lib/format';

const PLATES = [44, 44, 38, 38, 30, 30, 24, 18];

/** Free-shipping progress, shown as plates loading onto a bar. */
export function BarbellProgress({ subtotal }: { subtotal: number }) {
  const ratio = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
  const loaded = Math.round(ratio * PLATES.length);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const unlocked = remaining === 0;

  return (
    <div className="barbell" data-unlocked={unlocked || undefined}>
      <p className="barbell__msg">
        {unlocked ? (
          <>
            <strong>Free shipping unlocked.</strong> Bar's loaded.
          </>
        ) : (
          <>
            Add <strong>{formatPrice(remaining)}</strong> more for free shipping
          </>
        )}
      </p>
      <div
        className="barbell__rig"
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
      >
        <span className="barbell__sleeve" />
        <span className="barbell__collar" />
        <span className="barbell__plates">
          {PLATES.map((h, i) => (
            <span
              key={i}
              className="barbell__plate"
              data-on={i < loaded || undefined}
              style={{ height: h, transitionDelay: `${i * 40}ms` }}
            />
          ))}
        </span>
        <span className="barbell__shaft" />
      </div>
    </div>
  );
}
