import { useId } from 'react';

/** Decorative bumper plate with rim text, used behind hero products. */
export function WeightPlate({ className, label = '45' }: { className?: string; label?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <svg className={className} viewBox="0 0 500 500" aria-hidden="true">
      <defs>
        <path id={`rim-${id}`} d="M250 250 m-196 0 a196 196 0 1 1 392 0 a196 196 0 1 1 -392 0" />
        <radialGradient id={`g-${id}`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#2c2c31" />
          <stop offset="100%" stopColor="#141416" />
        </radialGradient>
      </defs>
      <circle cx="250" cy="250" r="246" fill={`url(#g-${id})`} stroke="#3a3a40" strokeWidth="2" />
      <circle cx="250" cy="250" r="214" fill="none" stroke="#c49a6c" strokeWidth="1.5" opacity="0.6" />
      <circle cx="250" cy="250" r="176" fill="none" stroke="#2f2f35" strokeWidth="18" />
      <text fontFamily="'JetBrains Mono Variable', monospace" fontSize="15" fontWeight="600" letterSpacing="9" fill="#c49a6c">
        <textPath href={`#rim-${id}`}>
          GYMAHOLIC · IRON &amp; BRONZE · EST. 2021 · NO DAYS OFF · GYMAHOLIC · IRON &amp; BRONZE ·
        </textPath>
      </text>
      <circle cx="250" cy="250" r="96" fill="#101012" stroke="#3a3a40" strokeWidth="2" />
      <circle cx="250" cy="250" r="34" fill="#0b0b0c" stroke="#a7a9ac" strokeWidth="6" />
      <text
        x="250"
        y="148"
        textAnchor="middle"
        fontFamily="'Big Shoulders Display Variable', sans-serif"
        fontWeight="900"
        fontSize="46"
        fill="#3a3a40"
      >
        {label}
      </text>
      <text
        x="250"
        y="378"
        textAnchor="middle"
        fontFamily="'Big Shoulders Display Variable', sans-serif"
        fontWeight="900"
        fontSize="30"
        letterSpacing="6"
        fill="#3a3a40"
      >
        LB
      </text>
    </svg>
  );
}
