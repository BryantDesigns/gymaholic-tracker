import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useCart } from '../lib/cart-context';
import { BagIcon, CloseIcon, MenuIcon } from './Icons';
import { Logo } from './Logo';

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=apparel', label: 'Apparel' },
  { to: '/shop?category=gear', label: 'Lifting Gear' },
  { to: '/fuel-log', label: 'Fuel Log' },
  { to: '/about', label: 'About' },
];

function isActive(to: string, pathname: string, search: string): boolean {
  const [path, query] = to.split('?');
  if (query) {
    const want = new URLSearchParams(query).get('category');
    return pathname === path && new URLSearchParams(search).get('category') === want;
  }
  if (path === '/shop') {
    return (pathname === '/shop' && !new URLSearchParams(search).get('category')) || pathname.startsWith('/shop/');
  }
  return pathname === path;
}

export function Header() {
  const { totals, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on navigation (render-time state adjustment).
  const [lastPath, setLastPath] = useState(location.key);
  if (lastPath !== location.key) {
    setLastPath(location.key);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <div className="announce" role="note">
        <div className="announce__track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} aria-hidden={i > 0 || undefined}>
              Free shipping on orders over $75 <i>✦</i> 30-day returns, even if you've worn it to the
              gym <i>✦</i> Track your fuel free with the Fuel Log <i>✦</i>
            </span>
          ))}
        </div>
      </div>
      <header className="header" data-scrolled={scrolled || undefined}>
        <div className="wrap header__inner">
          <button
            className="icon-btn header__menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <MenuIcon />
          </button>

          <Link to="/" className="header__logo" aria-label="Gymaholic home">
            <Logo />
          </Link>

          <nav className="header__nav" aria-label="Main">
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                className={isActive(n.to, location.pathname, location.search) ? 'active' : undefined}
                aria-current={isActive(n.to, location.pathname, location.search) ? 'page' : undefined}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <button className="cart-btn" onClick={open} aria-label={`Open cart, ${totals.itemCount} items`}>
            <BagIcon />
            <span className="cart-btn__label">Cart</span>
            <span className="cart-btn__count" data-empty={totals.itemCount === 0 || undefined}>
              {totals.itemCount}
            </span>
          </button>
        </div>
      </header>

      <div className="mobile-nav" id="mobile-nav" data-open={menuOpen || undefined} aria-hidden={!menuOpen}>
        <div className="mobile-nav__scrim" onClick={() => setMenuOpen(false)} />
        <nav className="mobile-nav__panel" aria-label="Mobile">
          <div className="mobile-nav__top">
            <Logo className="mobile-nav__logo" />
            <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <CloseIcon />
            </button>
          </div>
          <ul>
            {[{ to: '/', label: 'Home' }, ...NAV, { to: '/faq', label: 'FAQ' }, { to: '/contact', label: 'Contact' }].map(
              (n, i) => (
                <li key={n.label} style={{ animationDelay: `${60 + i * 40}ms` }}>
                  <Link to={n.to} tabIndex={menuOpen ? 0 : -1}>
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                    {n.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}
