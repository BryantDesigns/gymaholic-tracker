import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { Meta } from '../components/Meta';
import { submitNetlifyForm } from '../lib/forms';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus('busy');
    try {
      await submitNetlifyForm('contact', data);
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('err');
    }
  };

  return (
    <>
      <Meta title="Contact" description="Questions about an order, sizing or the Fuel Log? Get in touch." />
      <section className="page-hero page-hero--sm">
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h1 className="page-hero__title">Spot me</h1>
          <p className="lede">
            Order question, sizing help, or a product you want us to make? Send it over. We reply
            within one business day.
          </p>
        </div>
      </section>
      <div className="wrap contact">
        <form className="panel contact__form" onSubmit={onSubmit} name="contact">
          <p className="sr-only">
            <label>
              Leave this field empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>
          <div className="contact__row">
            <div className="field">
              <label htmlFor="c-name">Name</label>
              <input id="c-name" name="name" className="input" required autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="c-email">Email</label>
              <input id="c-email" name="email" type="email" className="input" required autoComplete="email" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="c-topic">Topic</label>
            <select id="c-topic" name="topic" className="input">
              <option>Order question</option>
              <option>Returns &amp; exchanges</option>
              <option>Sizing help</option>
              <option>Fuel Log</option>
              <option>Wholesale &amp; partnerships</option>
              <option>Something else</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-order">Order number (optional)</label>
            <input id="c-order" name="order" className="input" />
          </div>
          <div className="field">
            <label htmlFor="c-msg">Message</label>
            <textarea id="c-msg" name="message" className="input" required />
          </div>
          <button className="btn" type="submit" disabled={status === 'busy'}>
            {status === 'busy' ? 'Sending…' : 'Send message'}
          </button>
          <p className="form-status" data-tone={status === 'err' ? 'err' : 'ok'} aria-live="polite">
            {status === 'ok' && 'Message received. We’ll get back to you within one business day.'}
            {status === 'err' && 'Something went wrong. Please try again in a moment.'}
          </p>
        </form>
        <aside className="contact__aside">
          <div>
            <p className="label">Quick answers</p>
            <ul>
              <li><Link to="/faq#shipping">Shipping times &amp; costs</Link></li>
              <li><Link to="/faq#returns">Starting a return</Link></li>
              <li><Link to="/faq#sizing">Finding your size</Link></li>
            </ul>
          </div>
          <div>
            <p className="label">Hours</p>
            <p>Mon–Fri, 9am–5pm ET. Slower on leg day.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
