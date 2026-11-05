import { createContext, useContext } from 'react';
import type { CartLine, CartTotals, ResolvedLine } from './cart';

export interface CartContextValue {
  lines: ResolvedLine[];
  totals: CartTotals;
  add: (line: CartLine) => void;
  setQty: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
