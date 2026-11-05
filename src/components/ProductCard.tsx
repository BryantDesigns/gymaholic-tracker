import { useState } from 'react';
import { Link } from 'react-router';
import type { Product } from '../data/products';
import { formatPrice } from '../lib/format';
import { ProductArt } from './ProductArt';

export function ProductCard({ product, index }: { product: Product; index?: number }) {
  const [colorId, setColorId] = useState(product.colors[0].id);
  const href = `/shop/${product.slug}`;

  return (
    <article className="card" style={index !== undefined ? { animationDelay: `${index * 60}ms` } : undefined}>
      <Link to={href} className="card__stage" aria-label={product.name} tabIndex={-1}>
        {product.badge && (
          <span className="badge card__badge" data-tone={product.badge}>
            {product.badge}
          </span>
        )}
        <ProductArt product={product} colorId={colorId} className="card__art" />
        <span className="card__cta">View product</span>
      </Link>
      <div className="card__body">
        <div className="card__row">
          <h3 className="card__name">
            <Link to={href}>{product.name}</Link>
          </h3>
          <p className="card__price mono">{formatPrice(product.price)}</p>
        </div>
        <p className="card__tagline">{product.tagline}</p>
        <div className="swatches" role="radiogroup" aria-label={`${product.name} colours`}>
          {product.colors.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={c.id === colorId}
              aria-label={c.name}
              title={c.name}
              className="swatch"
              style={{ '--swatch': c.hex } as React.CSSProperties}
              onClick={() => setColorId(c.id)}
              onMouseEnter={() => setColorId(c.id)}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
