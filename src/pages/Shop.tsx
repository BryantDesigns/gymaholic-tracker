import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { Meta } from '../components/Meta';
import { ProductCard } from '../components/ProductCard';
import { categories, products, type Category } from '../data/products';
import { plural } from '../lib/format';

const SORTS = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  name: 'Name',
} as const;
type SortKey = keyof typeof SORTS;

const HEADLINES: Record<Category | 'all', [string, string]> = {
  all: ['The Shop', 'Everything you need for heavy days, and the rest days in between.'],
  apparel: ['Apparel', 'Heavyweight cotton, squat-proof stretch and room for your lats.'],
  gear: ['Lifting Gear', 'Belts, straps, wraps and chalk for when the bar gets heavy.'],
  accessories: ['Accessories', 'Caps, bags and towels for the walk to and from the gym.'],
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const rawCat = params.get('category');
  const category = (categories.some((c) => c.id === rawCat) ? rawCat : 'all') as Category | 'all';
  const rawSort = params.get('sort');
  const sort: SortKey = rawSort && Object.hasOwn(SORTS, rawSort) ? (rawSort as SortKey) : 'featured';

  const list = useMemo(() => {
    const filtered = category === 'all' ? products : products.filter((p) => p.category === category);
    const sorted = [...filtered];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return sorted;
  }, [category, sort]);

  const update = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params);
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const [title, sub] = HEADLINES[category];

  return (
    <>
      <Meta
        title={category === 'all' ? 'Shop' : title}
        description={`${sub} Free shipping over $75 and 30-day returns.`}
      />
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Gymaholic Supply Co.</p>
          <h1 className="page-hero__title">{title}</h1>
          <p className="lede">{sub}</p>
        </div>
      </section>

      <section className="wrap shop">
        <div className="toolbar">
          <div className="chips" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button
                key={c.id}
                className="chip"
                aria-pressed={c.id === category}
                onClick={() => update('category', c.id, 'all')}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="toolbar__right">
            <p className="mono toolbar__count" aria-live="polite">
              {plural(list.length, 'product')}
            </p>
            <label className="select">
              <span className="sr-only">Sort by</span>
              <select value={sort} onChange={(e) => update('sort', e.target.value, 'featured')}>
                {Object.entries(SORTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid" key={category + sort}>
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
