import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from './cart-context';
import { startCheckout } from './checkout';

export function useCheckout() {
  const { lines, close } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await startCheckout(lines);
      if (result.kind === 'redirect') {
        window.location.assign(result.url);
        return; // keep busy state while the browser navigates away
      }
      close();
      navigate('/checkout/success?demo=1');
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(false);
  };

  return { checkout, busy, error };
}
