import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowIcon, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons';
import { Meta } from '../components/Meta';
import { ProductArt } from '../components/ProductArt';
import { ProductCard } from '../components/ProductCard';
import { QtyStepper } from '../components/QtyStepper';
import { SizeGuide } from '../components/SizeGuide';
import { WeightPlate } from '../components/WeightPlate';
import { categories, getProductBySlug, products, type Product as P } from '../data/products';
import { useCart } from '../lib/cart-context';
import { formatPrice } from '../lib/format';
import NotFound from './NotFound';

export default function ProductPage() {
  const { slug = '' } = useParams();
  const product = getProductBySlug(slug);
  if (!product) return <NotFound />;
  // Remount on product change so selections reset.
  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }: { product: P }) {
  const { add } = useCart();
  const [colorId, setColorId] = useState(product.colors[0].id);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const color = product.colors.find((c) => c.id === colorId)!;
  const needsSize = product.sizes.length > 0;
  const catLabel = categories.find((c) => c.id === product.category)?.label;
  const related = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 4);

  const onAdd = () => {
    if (needsSize && !size) {
      setSizeError(true);
      document.getElementById('size-group')?.focus();
      return;
    }
    add({ productId: product.id, colorId, size: needsSize ? size : null, quantity: qty });
    setQty(1);
  };

  return (
    <>
      <Meta title={product.name} description={`${product.tagline} ${product.description.slice(0, 120)}…`} />
      <div className="wrap pdp">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/shop">Shop</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/shop?category=${product.category}`}>{catLabel}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="pdp__grid">
          <div className="pdp__stage">
            <WeightPlate className="pdp__plate" />
            <ProductArt key={colorId} product={product} colorId={colorId} className="pdp__art" />
            <p className="pdp__stage-label mono">
              {color.name} <span>·</span> {product.id.toUpperCase()}
            </p>
          </div>

          <div className="pdp__info">
            {product.badge && (
              <span className="badge" data-tone={product.badge}>
                {product.badge}
              </span>
            )}
            <h1 className="pdp__title">{product.name}</h1>
            <p className="pdp__tagline">{product.tagline}</p>
            <p className="pdp__price mono">{formatPrice(product.price)}</p>

            <fieldset className="opt">
              <legend className="label">
                Colour: <strong>{color.name}</strong>
              </legend>
              <div className="swatches swatches--lg">
                {product.colors.map((c) => (
                  <label key={c.id} className="swatch" style={{ '--swatch': c.hex } as React.CSSProperties} title={c.name}>
                    <input
                      type="radio"
                      name="color"
                      value={c.id}
                      checked={c.id === colorId}
                      onChange={() => setColorId(c.id)}
                      className="sr-only"
                    />
                    <span className="sr-only">{c.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {needsSize && (
              <fieldset className="opt" aria-invalid={sizeError || undefined} aria-describedby={sizeError ? 'size-err' : undefined}>
                <div className="opt__row">
                  <legend className="label">
                    Size{size && <>: <strong>{size}</strong></>}
                  </legend>
                  <button type="button" className="text-btn" onClick={() => setGuideOpen(true)}>
                    Size guide
                  </button>
                </div>
                <div className="sizes" id="size-group" tabIndex={-1}>
                  {product.sizes.map((s) => (
                    <label key={s} className="size">
                      <input
                        type="radio"
                        name="size"
                        value={s}
                        checked={s === size}
                        onChange={() => {
                          setSize(s);
                          setSizeError(false);
                        }}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
                {sizeError && (
                  <p id="size-err" className="form-status" data-tone="err" role="alert">
                    Pick a size first.
                  </p>
                )}
              </fieldset>
            )}

            <div className="pdp__buy">
              <QtyStepper value={qty} onChange={setQty} />
              <button className="btn pdp__add" onClick={onAdd}>
                Add to cart · {formatPrice(product.price * qty)}
              </button>
            </div>

            <ul className="perks">
              <li>
                <TruckIcon /> Free shipping over $75. Ships in 1–2 business days.
              </li>
              <li>
                <ReturnIcon /> 30-day returns, even if you've worn it to the gym.
              </li>
              <li>
                <ShieldIcon /> Secure checkout powered by Stripe.
              </li>
            </ul>

            <div className="pdp__desc">
              <p>{product.description}</p>
            </div>

            <details className="acc" open>
              <summary>Details &amp; specs</summary>
              <ul>
                {product.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </details>
            <details className="acc">
              <summary>Shipping &amp; returns</summary>
              <p>
                Orders over $75 ship free within the US; under that it's a flat $6.95. Not right? Send it
                back within 30 days for a full refund or exchange. <Link to="/faq#returns">Full policy</Link>.
              </p>
            </details>
            <details className="acc">
              <summary>Care</summary>
              <p>
                {product.category === 'apparel'
                  ? 'Machine wash cold, inside out. Tumble dry low or hang dry. Don’t iron the print.'
                  : product.art === 'belt'
                    ? 'Wipe clean with a damp cloth. Condition the leather every few months. Keep it out of hot cars.'
                    : 'Hand wash or wipe clean. Air dry fully before packing it back in your bag.'}
              </p>
            </details>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Superset it</p>
              <h2>Pairs well with</h2>
            </div>
            <Link to="/shop" className="link-arrow">
              Back to shop <ArrowIcon width={16} height={16} />
            </Link>
          </div>
          <div className="grid grid--4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <SizeGuide product={product} open={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}
