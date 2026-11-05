import { Link } from 'react-router';
import { Meta } from '../components/Meta';

const SECTIONS: { id: string; title: string; items: [string, React.ReactNode][] }[] = [
  {
    id: 'shipping',
    title: 'Shipping',
    items: [
      ['How much is shipping?', 'Orders over $75 ship free within the US. Below that, it’s a flat $6.95.'],
      ['How fast will my order arrive?', 'We pack orders within 1–2 business days. US delivery usually takes 3–5 business days after that. You’ll get a tracking link by email as soon as it ships.'],
      ['Do you ship internationally?', 'Not yet. We’re US-only for now while we get the basics right. Join the 5AM Club and we’ll email you when international shipping opens.'],
    ],
  },
  {
    id: 'returns',
    title: 'Returns & exchanges',
    items: [
      ['What’s your return policy?', 'You have 30 days from delivery to return anything for a full refund or exchange, even if you’ve worn it to the gym. We just ask that it’s clean and undamaged.'],
      ['How do I start a return?', <>Email us through the <Link to="/contact">contact page</Link> with your order number and what you’d like to swap or return. We’ll send a prepaid label.</>],
      ['When will I get my refund?', 'Refunds go back to your original payment method within 5 business days of the return reaching us.'],
    ],
  },
  {
    id: 'sizing',
    title: 'Sizing & fit',
    items: [
      ['How do your tees fit?', 'Boxy with dropped shoulders. If you’re between sizes or prefer a closer fit, size down. Each product page has a size guide.'],
      ['How do I size a lever belt?', 'Measure around your navel, where you brace, not your jeans size. If you’re between sizes, size up. The lever can be moved to fine-tune the fit.'],
      ['Is the hoodie oversized?', 'Yes, it’s cut roomy on purpose. Size down one for a regular fit.'],
    ],
  },
  {
    id: 'fuel-log',
    title: 'Fuel Log',
    items: [
      ['Is the Fuel Log really free?', 'Yes. There’s no account and no paywall, and there never will be.'],
      ['Where is my data stored?', 'Only in your browser’s local storage, on your device. We never see it. Clearing your browser data or switching devices will start you fresh.'],
      ['Did my old meals carry over?', 'If you used the original Gymaholic tracker in this browser, your saved meals were moved into today’s log automatically.'],
    ],
  },
  {
    id: 'orders',
    title: 'Orders & payment',
    items: [
      ['What payment methods do you accept?', 'All major cards, Apple Pay and Google Pay, processed securely by Stripe. We never see or store your card details.'],
      ['Can I change or cancel my order?', 'Message us within 2 hours of ordering and we’ll do our best to catch it before it’s packed.'],
    ],
  },
];

export default function Faq() {
  return (
    <>
      <Meta title="FAQ, Shipping & Returns" description="Shipping, returns, sizing and Fuel Log questions, answered." />
      <section className="page-hero page-hero--sm">
        <div className="wrap">
          <p className="eyebrow">Help</p>
          <h1 className="page-hero__title">Questions, answered</h1>
          <p className="lede">
            Can’t find what you need? <Link to="/contact">Get in touch</Link> and a real person will
            answer within one business day.
          </p>
        </div>
      </section>
      <div className="wrap faq">
        <nav className="faq__nav" aria-label="FAQ sections">
          {SECTIONS.map((s, i) => (
            <a key={s.id} href={`#${s.id}`}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span> {s.title}
            </a>
          ))}
        </nav>
        <div className="faq__body">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="faq__section">
              <h2>{s.title}</h2>
              {s.items.map(([q, a]) => (
                <details key={q} className="acc">
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
