import { useState, type FormEvent } from 'react';
import { submitNetlifyForm } from '../lib/forms';

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get('email')?.toString() ?? '';
    setStatus('busy');
    try {
      await submitNetlifyForm('newsletter', { email });
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('err');
    }
  };

  return (
    <form className="newsletter" data-compact={compact || undefined} onSubmit={onSubmit}>
      <label htmlFor={compact ? 'nl-email-f' : 'nl-email'} className="sr-only">
        Email address
      </label>
      <div className="newsletter__row">
        <input
          id={compact ? 'nl-email-f' : 'nl-email'}
          className="input"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@5amclub.com"
        />
        <button className="btn" type="submit" disabled={status === 'busy'}>
          {status === 'busy' ? 'Joining…' : 'Join'}
        </button>
      </div>
      <p className="form-status" data-tone={status === 'err' ? 'err' : 'ok'} aria-live="polite">
        {status === 'ok' && "You're in. Check your inbox for 10% off your first order."}
        {status === 'err' && 'That didn’t go through. Try again in a moment.'}
      </p>
    </form>
  );
}
