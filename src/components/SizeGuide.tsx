import type { Product } from '../data/products';
import { useDialog } from '../lib/useDialog';
import { CloseIcon } from './Icons';

const APPAREL = [
  ['XS', '34–36', '27'],
  ['S', '36–38', '28'],
  ['M', '39–41', '29'],
  ['L', '42–44', '30'],
  ['XL', '45–47', '31'],
  ['2XL', '48–50', '32'],
];
const BELT = [
  ['S', '24–30'],
  ['M', '29–35'],
  ['L', '34–40'],
  ['XL', '39–45'],
];

export function SizeGuide({ product, open, onClose }: { product: Product; open: boolean; onClose: () => void }) {
  const ref = useDialog(open);

  const isBelt = product.art === 'belt';

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="size-guide-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal__inner">
        <div className="modal__head">
          <h2 id="size-guide-title">Size guide</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close size guide">
            <CloseIcon />
          </button>
        </div>
        {isBelt ? (
          <>
            <p className="modal__note">
              Measure around your navel, where you brace, not your jeans size. If you're between sizes, size up.
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Waist (in)</th>
                </tr>
              </thead>
              <tbody>
                {BELT.map((r) => (
                  <tr key={r[0]}>
                    {r.map((c) => (
                      <td key={c}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <p className="modal__note">
              Measurements are body measurements in inches. Our tops run boxy, so size down if you like a
              closer fit. The hoodie is cut oversized.
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (in)</th>
                  <th>Body length (in)</th>
                </tr>
              </thead>
              <tbody>
                {APPAREL.map((r) => (
                  <tr key={r[0]}>
                    {r.map((c) => (
                      <td key={c}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </dialog>
  );
}
