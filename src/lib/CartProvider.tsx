import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { cartReducer, cartTotals, resolveLines, type CartLine } from './cart';
import { CartContext, type CartContextValue } from './cart-context';
import { readJSON, writeJSON } from './storage';

const STORAGE_KEY = 'gymaholic:cart:v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, dispatch] = useReducer(cartReducer, undefined, () =>
    readJSON<CartLine[]>(STORAGE_KEY, []),
  );
  const [isOpen, setOpen] = useState(false);

  useEffect(() => writeJSON(STORAGE_KEY, raw), [raw]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY && e.key !== null) return;
      dispatch({ type: 'replace', lines: readJSON<CartLine[]>(STORAGE_KEY, []) });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((line: CartLine) => {
    dispatch({ type: 'add', line });
    setOpen(true);
  }, []);
  const setQty = useCallback(
    (key: string, quantity: number) => dispatch({ type: 'setQty', key, quantity }),
    [],
  );
  const remove = useCallback((key: string) => dispatch({ type: 'remove', key }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = resolveLines(raw);
    return { lines, totals: cartTotals(lines), add, setQty, remove, clear, isOpen, open, close };
  }, [raw, add, setQty, remove, clear, isOpen, open, close]);

  return <CartContext value={value}>{children}</CartContext>;
}
