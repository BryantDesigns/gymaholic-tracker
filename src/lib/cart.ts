import {
  FLAT_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  getProductById,
  type Product,
} from '../data/products';

export interface CartLine {
  productId: string;
  colorId: string;
  size: string | null;
  quantity: number;
}

export const MAX_QTY = 10;

export type CartAction =
  | { type: 'add'; line: CartLine }
  | { type: 'setQty'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'replace'; lines: CartLine[] };

export function lineKey(line: Pick<CartLine, 'productId' | 'colorId' | 'size'>): string {
  return `${line.productId}::${line.colorId}::${line.size ?? '-'}`;
}

const clampQty = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.floor(n)));

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.line);
      const existing = state.find((l) => lineKey(l) === key);
      if (existing) {
        return state.map((l) =>
          lineKey(l) === key ? { ...l, quantity: clampQty(l.quantity + action.line.quantity) } : l,
        );
      }
      return [...state, { ...action.line, quantity: clampQty(action.line.quantity) }];
    }
    case 'setQty':
      if (action.quantity <= 0) return state.filter((l) => lineKey(l) !== action.key);
      return state.map((l) =>
        lineKey(l) === action.key ? { ...l, quantity: clampQty(action.quantity) } : l,
      );
    case 'remove':
      return state.filter((l) => lineKey(l) !== action.key);
    case 'clear':
      return [];
    case 'replace':
      return action.lines;
  }
}

export interface ResolvedLine extends CartLine {
  key: string;
  product: Product;
  colorName: string;
  lineTotal: number;
}

/** Join cart lines with catalog data, dropping anything no longer sold. */
export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const line of lines) {
    const product = getProductById(line.productId);
    if (!product) continue;
    const color = product.colors.find((c) => c.id === line.colorId);
    if (!color) continue;
    if (product.sizes.length > 0 && (!line.size || !product.sizes.includes(line.size))) continue;
    out.push({
      ...line,
      key: lineKey(line),
      product,
      colorName: color.name,
      lineTotal: product.price * line.quantity,
    });
  }
  return out;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  /** Cents remaining until free shipping (0 when unlocked). */
  toFreeShipping: number;
}

export function cartTotals(lines: ResolvedLine[]): CartTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  return {
    itemCount,
    subtotal,
    shipping,
    total: subtotal + shipping,
    toFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
  };
}
