import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from './cart-context';
import { startCheckout } from './checkout';

export function useCheckout() {
  const { lines, close } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coming back from Stripe via the Back button restores this page from the
  // back/forward cache with busy=true. Re-enable the button when that happens.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => e.persisted && setBusy(false);
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

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
      navigate('/checkout/success?demo=1', { state: { freshOrder: true } });
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(false);
  };

  return { checkout, busy, error };
}
