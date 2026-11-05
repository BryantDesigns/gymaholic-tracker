import { Meta } from '../components/Meta';

/*
 * Starter legal copy. Review with a qualified professional before launch and
 * update the contact details, governing law and effective date.
 */

const EFFECTIVE = 'November 5, 2026';

export function Privacy() {
  return (
    <>
      <Meta title="Privacy Policy" />
      <article className="wrap legal">
        <p className="eyebrow">Effective {EFFECTIVE}</p>
        <h1 className="page-hero__title">Privacy policy</h1>
        <h2>What we collect</h2>
        <p>
          When you place an order, our payment processor Stripe collects your name, email, shipping
          address and payment details to complete the purchase. We receive order and shipping details;
          we never see or store your full card number.
        </p>
        <p>
          If you join our mailing list or send us a message, we store the email address and message you
          provide so we can respond.
        </p>
        <h2>The Fuel Log</h2>
        <p>
          Meals and goals you log in the Fuel Log are stored only in your browser’s local storage. They
          are never sent to our servers.
        </p>
        <h2>Cookies &amp; storage</h2>
        <p>
          We use your browser’s local storage to remember your cart and Fuel Log. We don’t use
          advertising cookies or sell your personal information.
        </p>
        <h2>Your choices</h2>
        <p>
          You can unsubscribe from emails at any time using the link in every email, and you can ask us
          to access or delete your information by contacting us.
        </p>
        <h2>Contact</h2>
        <p>Questions about privacy? Reach us through the contact page.</p>
      </article>
    </>
  );
}

export function Terms() {
  return (
    <>
      <Meta title="Terms of Service" />
      <article className="wrap legal">
        <p className="eyebrow">Effective {EFFECTIVE}</p>
        <h1 className="page-hero__title">Terms of service</h1>
        <h2>Orders</h2>
        <p>
          All orders are subject to availability and acceptance. Prices are listed in US dollars and may
          change without notice. Taxes are calculated at checkout.
        </p>
        <h2>Shipping &amp; returns</h2>
        <p>
          Shipping times are estimates. Items may be returned within 30 days of delivery in clean,
          undamaged condition for a refund or exchange, as described on our FAQ page.
        </p>
        <h2>Training safely</h2>
        <p>
          Lifting gear helps, but it doesn’t replace good technique. Use our products as intended, train
          within your limits and consult a professional before starting a new program. The Fuel Log is
          provided for general information and is not medical or nutritional advice.
        </p>
        <h2>Intellectual property</h2>
        <p>
          The Gymaholic name, logo, designs and site content belong to Gymaholic and may not be used
          without permission.
        </p>
        <h2>Contact</h2>
        <p>Questions about these terms? Reach us through the contact page.</p>
      </article>
    </>
  );
}
