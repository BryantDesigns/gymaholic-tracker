import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import ironTexture from '../assets/iron-texture.png';
import { ArrowIcon } from '../components/Icons';
import { Marquee } from '../components/Marquee';
import { Meta } from '../components/Meta';
import { Newsletter } from '../components/Newsletter';
import { ProductArt } from '../components/ProductArt';
import { ProductCard } from '../components/ProductCard';
import { WeightPlate } from '../components/WeightPlate';
import { getProductBySlug, products, type Product } from '../data/products';
import { formatPrice } from '../lib/format';

const HERO_SLUGS = [
  'plate-stack-oversized-hoodie',
  'iron-faithful-heavyweight-tee',
  'gymaholic-10mm-lever-belt',
  'bronze-bar-shaker',
];
const heroProducts = HERO_SLUGS.map(getProductBySlug).filter(Boolean) as Product[];

const CODE = [
  ['Re-rack your weights.', 'Nobody wants to find your 45s on the leg press.'],
  ['Wipe the bench.', 'Your sweat angel is not a gift.'],
  ['Log your fuel.', 'You can’t out-train a diet you don’t track.'],
  ['Show up on Monday.', 'And Tuesday. You get the idea.'],
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

function HeroStage() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const p = heroProducts[i];

  useEffect(() => {
    if (reduced || paused) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % heroProducts.length), 4200);
    return () => window.clearInterval(t);
  }, [reduced, paused]);

  return (
    <div
      className="hero__stage"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <WeightPlate className="hero__plate" />
      {heroProducts.map((hp, idx) => (
        <div key={hp.id} className="hero__product" data-active={idx === i || undefined} aria-hidden={idx !== i}>
          <ProductArt product={hp} />
        </div>
      ))}
      <Link to={`/shop/${p.slug}`} className="hero__tag">
        <span className="mono hero__tag-idx">
          {String(i + 1).padStart(2, '0')} / {String(heroProducts.length).padStart(2, '0')}
        </span>
        <span className="hero__tag-name">{p.name}</span>
        <span className="mono hero__tag-price">{formatPrice(p.price)}</span>
        <ArrowIcon width={18} height={18} />
      </Link>
      <div className="hero__dots" role="tablist" aria-label="Featured products">
        {heroProducts.map((hp, idx) => (
          <button
            key={hp.id}
            role="tab"
            aria-selected={idx === i}
            aria-label={hp.name}
            onClick={() => setI(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      <Meta description="Heavyweight gym apparel, lifting straps, belts and shakers, plus a free meal and protein tracker. Built for people who plan their week around leg day." />

      <section className="hero">
        <div
          className="hero__texture"
          style={{ backgroundImage: `url(${ironTexture})` }}
          aria-hidden="true"
        />
        <div className="wrap hero__inner">
          <div className="hero__copy">
            <p className="eyebrow reveal">Drop 01 · Iron &amp; Bronze</p>
            <h1 className="hero__title">
              <span className="reveal striped" style={{ animationDelay: '80ms' }}>
                Obsessed
              </span>
              <span className="reveal" style={{ animationDelay: '160ms' }}>
                with the
              </span>
              <span className="reveal bronze" style={{ animationDelay: '240ms' }}>
                iron.
              </span>
            </h1>
            <p className="lede reveal" style={{ animationDelay: '320ms' }}>
              Heavyweight apparel and no-nonsense lifting gear for people who plan their week around
              leg day. Built to survive chalk, sweat and your worst deadlift form.
            </p>
            <div className="hero__ctas reveal" style={{ animationDelay: '400ms' }}>
              <Link to="/shop" className="btn">
                Shop the drop <ArrowIcon />
              </Link>
              <Link to="/fuel-log" className="btn btn--ghost">
                Free Fuel Log
              </Link>
            </div>
            <dl className="hero__specs reveal" style={{ animationDelay: '480ms' }}>
              <div>
                <dt>Tee weight</dt>
                <dd>300 GSM</dd>
              </div>
              <div>
                <dt>Belt</dt>
                <dd>10 MM</dd>
              </div>
              <div>
                <dt>Returns</dt>
                <dd>30 DAYS</dd>
              </div>
            </dl>
          </div>
          <HeroStage />
        </div>
      </section>

      <Marquee
        items={['Re-rack your weights', 'Wipe the bench', 'No days off', 'Chalk is not a crime', 'Leg day is not optional']}
      />

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Set 01 · The Drop</p>
              <h2>
                Built for <span className="bronze">heavy</span> days
              </h2>
            </div>
            <Link to="/shop" className="link-arrow">
              Shop all {products.length} products <ArrowIcon width={16} height={16} />
            </Link>
          </div>
          <div className="grid">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap cats">
          {[
            { id: 'apparel', n: '01', title: 'Apparel', copy: 'Heavyweight tees, hoodies, stringers and joggers.' },
            { id: 'gear', n: '02', title: 'Lifting Gear', copy: 'Belts, straps, wraps and chalk for heavy sets.' },
            { id: 'accessories', n: '03', title: 'Accessories', copy: 'Caps, bags and towels for the walk to and from the gym.' },
          ].map((c) => (
            <Link key={c.id} to={`/shop?category=${c.id}`} className="cat">
              <span className="cat__n striped">{c.n}</span>
              <span className="cat__title">{c.title}</span>
              <span className="cat__copy">{c.copy}</span>
              <span className="cat__go">
                Shop <ArrowIcon width={18} height={18} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section fuel-teaser">
        <div className="wrap fuel-teaser__inner">
          <div>
            <p className="eyebrow">Set 02 · Free Tool</p>
            <h2 className="fuel-teaser__title">
              Track your fuel.
              <br />
              <span className="bronze">Skip the subscription.</span>
            </h2>
            <p className="lede">
              The Fuel Log is our free meal, calorie and protein tracker. It runs in your browser, so
              there's no account to make, no ads and no paywall, and your data stays on your device.
            </p>
            <Link to="/fuel-log" className="btn">
              Open the Fuel Log <ArrowIcon />
            </Link>
          </div>
          <div className="fuel-preview" aria-hidden="true">
            <div className="fuel-preview__ring">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" />
                <circle cx="60" cy="60" r="52" pathLength="100" strokeDasharray="74 100" />
              </svg>
              <div>
                <span className="mono">1,840</span>
                <small>of 2,500 kcal</small>
              </div>
            </div>
            <ul className="fuel-preview__list">
              <li>
                <span>Overnight oats</span>
                <span className="mono">520 · 32g</span>
              </li>
              <li>
                <span>Chicken, rice &amp; greens</span>
                <span className="mono">680 · 58g</span>
              </li>
              <li>
                <span>Post-lift shake</span>
                <span className="mono">240 · 40g</span>
              </li>
              <li>
                <span>Greek yogurt &amp; berries</span>
                <span className="mono">400 · 12g</span>
              </li>
            </ul>
            <div className="fuel-preview__bar">
              <span>Protein</span>
              <span className="mono">142 / 180 g</span>
              <i style={{ width: '79%' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section code" id="code">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Set 03 · House Rules</p>
              <h2>The Gymaholic Code</h2>
            </div>
          </div>
          <ol className="code__list">
            {CODE.map(([rule, note], i) => (
              <li key={rule}>
                <span className="code__n mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="code__rule">{rule}</span>
                <span className="code__note">{note}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section join">
        <div className="wrap join__inner">
          <div>
            <p className="eyebrow">The 5AM Club</p>
            <h2 className="join__title">
              First in.
              <br />
              <span className="bronze">Last to re‑rack.</span>
            </h2>
          </div>
          <div>
            <p className="lede">
              Early access to drops, training notes we actually use, and 10% off your first order. One
              email a fortnight, at most.
            </p>
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  );
}
