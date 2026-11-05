export function Marquee({ items, tone = 'bronze' }: { items: string[]; tone?: 'bronze' | 'chalk' }) {
  const row = (hidden: boolean) => (
    <div className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t}>
          {t}
          <svg viewBox="0 0 100 36" width="44" height="16" aria-hidden="true">
            <rect x="0" y="12" width="6" height="12" />
            <rect x="8" y="4" width="7" height="28" />
            <rect x="17" y="0" width="8" height="36" />
            <rect x="25" y="15" width="50" height="6" />
            <rect x="75" y="0" width="8" height="36" />
            <rect x="85" y="4" width="7" height="28" />
            <rect x="94" y="12" width="6" height="12" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" data-tone={tone}>
      {row(false)}
      {row(true)}
    </div>
  );
}
