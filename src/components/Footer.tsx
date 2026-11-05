import { Link } from 'react-router';
import { Logo } from './Logo';
import { Newsletter } from './Newsletter';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo className="footer__logo" />
            <p>
              Heavyweight apparel and no-nonsense lifting gear for people who plan their week around
              leg day.
            </p>
          </div>
          <div className="footer__news">
            <p className="eyebrow">The 5AM Club</p>
            <p className="footer__news-title">New drops, training notes, 10% off your first order.</p>
            <Newsletter compact />
          </div>
        </div>

        <div className="footer__cols">
          <div>
            <h3>Shop</h3>
            <ul>
              <li><Link to="/shop">All products</Link></li>
              <li><Link to="/shop?category=apparel">Apparel</Link></li>
              <li><Link to="/shop?category=gear">Lifting gear</Link></li>
              <li><Link to="/shop?category=accessories">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h3>Train</h3>
            <ul>
              <li><Link to="/fuel-log">Fuel Log</Link></li>
              <li><Link to="/about#code">The Gymaholic Code</Link></li>
            </ul>
          </div>
          <div>
            <h3>Help</h3>
            <ul>
              <li><Link to="/faq#shipping">Shipping</Link></li>
              <li><Link to="/faq#returns">Returns</Link></li>
              <li><Link to="/faq#sizing">Size guide</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__wordmark" aria-hidden="true">
          <span className="striped">Gym</span>aholic
        </div>

        <div className="footer__bottom">
          <p>© {year} Gymaholic. Re-rack your weights.</p>
          <p className="mono">Lift heavy · Eat well · Repeat</p>
        </div>
      </div>
    </footer>
  );
}
