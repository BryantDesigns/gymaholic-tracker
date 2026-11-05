import { CODE } from '../data/code';

export function CodeSection({ eyebrow, featuredOnly = false }: { eyebrow: string; featuredOnly?: boolean }) {
  const rules = featuredOnly ? CODE.filter((r) => r.featured) : CODE;
  return (
    <section className="section code" id="code">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>The Gymaholic Code</h2>
          </div>
        </div>
        <ol className="code__list">
          {rules.map(({ rule, note }, i) => (
            <li key={rule}>
              <span className="code__n mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="code__rule">{rule}</span>
              <span className="code__note">{note}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
