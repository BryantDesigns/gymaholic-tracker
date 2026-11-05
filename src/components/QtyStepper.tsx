import { MAX_QTY } from '../lib/cart';
import { MinusIcon, PlusIcon } from './Icons';

export function QtyStepper({
  value,
  onChange,
  min = 1,
  label = 'Quantity',
  size = 'md',
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  label?: string;
  size?: 'sm' | 'md';
}) {
  return (
    <div className="qty" data-size={size} role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <MinusIcon width={16} height={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QTY}
        aria-label="Increase quantity"
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}
