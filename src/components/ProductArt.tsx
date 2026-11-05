import { useId } from 'react';
import type { ArtKind, ColorOption, Product } from '../data/products';

/**
 * Original flat illustrations for every product type, recoloured per variant.
 * Swap for photography later by rendering an <img> here instead.
 */

const SHADE = 'rgba(0,0,0,0.28)';
const DEEP = 'rgba(0,0,0,0.45)';
const LIGHT = 'rgba(255,255,255,0.12)';
const STEEL = '#a7a9ac';
const DISPLAY = "'Big Shoulders Display Variable', 'Arial Narrow', sans-serif";

interface ArtProps {
  c: ColorOption;
  print?: string;
  uid: string;
}

function Dumbbell({ x, y, w, color }: { x: number; y: number; w: number; color: string }) {
  // Logo-style dumbbell: stacked plates either side of a bar.
  const s = w / 100;
  return (
    <g transform={`translate(${x - w / 2} ${y - 18 * s}) scale(${s})`} fill={color}>
      <rect x="0" y="12" width="6" height="12" rx="1" />
      <rect x="8" y="4" width="7" height="28" rx="1.5" />
      <rect x="17" y="0" width="8" height="36" rx="1.5" />
      <rect x="25" y="15" width="50" height="6" />
      <rect x="75" y="0" width="8" height="36" rx="1.5" />
      <rect x="85" y="4" width="7" height="28" rx="1.5" />
      <rect x="94" y="12" width="6" height="12" rx="1" />
    </g>
  );
}

function PrintText({
  text,
  x,
  y,
  size,
  color,
  spacing = 1,
  maxWidth = 150,
}: {
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  spacing?: number;
  maxWidth?: number;
}) {
  // Big Shoulders at weight 900 averages ~0.5em per glyph; shrink long prints to fit.
  const fitted = Math.min(size, (maxWidth - spacing * text.length) / (text.length * 0.5));
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontFamily={DISPLAY}
      fontWeight={900}
      fontSize={fitted}
      letterSpacing={spacing}
      fill={color}
    >
      {text}
    </text>
  );
}

function Tee({ c, print }: ArtProps) {
  return (
    <g>
      <path
        d="M140 70 L105 82 L48 118 L76 180 L112 164 L112 342 Q200 352 288 342 L288 164 L324 180 L352 118 L295 82 L260 70 Q246 98 200 98 Q154 98 140 70 Z"
        fill={c.hex}
      />
      <path d="M48 118 L76 180 L112 164 L108 140 Z" fill={SHADE} />
      <path d="M352 118 L324 180 L288 164 L292 140 Z" fill={SHADE} />
      <path d="M112 164 L112 342 Q130 344 140 345 L132 170 Z" fill={SHADE} opacity="0.6" />
      <path d="M140 70 Q200 112 260 70" fill="none" stroke={DEEP} strokeWidth="9" strokeLinecap="round" />
      <path d="M150 74 Q200 104 250 74" fill="none" stroke={LIGHT} strokeWidth="2" />
      <path d="M180 250 Q200 300 186 340" fill="none" stroke={SHADE} strokeWidth="2" opacity="0.5" />
      <path d="M250 220 Q238 280 256 342" fill="none" stroke={SHADE} strokeWidth="2" opacity="0.45" />
      <Dumbbell x={200} y={150} w={78} color={c.ink} />
      {print && <PrintText text={print} x={200} y={205} size={30} color={c.ink} maxWidth={150} />}
    </g>
  );
}

function Hoodie({ c, print }: ArtProps) {
  return (
    <g>
      <path d="M148 64 Q200 22 252 64 L268 96 Q200 128 132 96 Z" fill={c.hex} />
      <path d="M148 64 Q200 22 252 64 L268 96 Q200 128 132 96 Z" fill={DEEP} opacity="0.55" />
      <path
        d="M134 86 L82 104 Q60 114 55 140 L34 300 L76 308 L100 176 L104 348 L296 348 L300 176 L324 308 L366 300 L345 140 Q340 114 318 104 L266 86 Q200 128 134 86 Z"
        fill={c.hex}
      />
      <path d="M150 80 Q200 140 250 80 Q240 112 200 118 Q160 112 150 80 Z" fill={DEEP} />
      <path d="M34 300 L76 308 L73 328 L31 320 Z" fill={c.hex} />
      <path d="M34 300 L76 308 L73 328 L31 320 Z" fill={SHADE} />
      <path d="M366 300 L324 308 L327 328 L369 320 Z" fill={c.hex} />
      <path d="M366 300 L324 308 L327 328 L369 320 Z" fill={SHADE} />
      <path d="M55 140 L34 300 L76 308 L100 176 Z" fill={SHADE} opacity="0.7" />
      <path d="M345 140 L366 300 L324 308 L300 176 Z" fill={SHADE} opacity="0.7" />
      <rect x="104" y="330" width="192" height="20" fill={SHADE} />
      <path d="M140 258 L260 258 L282 322 L118 322 Z" fill={c.hex} />
      <path d="M140 258 L260 258 L282 322 L118 322 Z" fill="none" stroke={SHADE} strokeWidth="3" />
      <path d="M140 258 L118 322 M260 258 L282 322" stroke={DEEP} strokeWidth="3" />
      {print && <PrintText text={print} x={200} y={212} size={34} color={c.ink} spacing={2} maxWidth={170} />}
      <g opacity="0.9">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={150} y={222 + i * 7} width={100} height={3} fill={c.ink} />
        ))}
      </g>
    </g>
  );
}

function Tank({ c, print }: ArtProps) {
  return (
    <g>
      <path
        d="M152 58 L172 58 Q176 136 200 140 Q224 136 228 58 L248 58 Q252 142 294 176 L298 344 Q200 354 102 344 L106 176 Q148 142 152 58 Z"
        fill={c.hex}
      />
      <path d="M172 58 Q176 136 200 140 Q224 136 228 58" fill="none" stroke={DEEP} strokeWidth="6" />
      <path d="M152 58 Q148 142 106 176" fill="none" stroke={DEEP} strokeWidth="6" />
      <path d="M248 58 Q252 142 294 176" fill="none" stroke={DEEP} strokeWidth="6" />
      <path d="M106 176 L102 344 Q116 346 128 347 L124 190 Z" fill={SHADE} />
      <path d="M294 176 L298 344 Q284 346 272 347 L276 190 Z" fill={SHADE} />
      {print && <PrintText text={print} x={200} y={238} size={36} color={c.ink} spacing={1.5} maxWidth={140} />}
      <Dumbbell x={200} y={272} w={60} color={c.ink} />
    </g>
  );
}

function Jogger({ c }: ArtProps) {
  return (
    <g>
      <path
        d="M120 82 L280 82 L292 300 L284 352 L216 352 L206 168 Q200 154 194 168 L184 352 L116 352 L108 300 Z"
        fill={c.hex}
      />
      <rect x="118" y="52" width="164" height="34" rx="6" fill={c.hex} />
      <rect x="118" y="52" width="164" height="34" rx="6" fill={SHADE} />
      <path d="M194 86 L186 118 M206 86 L214 118" stroke={c.ink} strokeWidth="3" strokeLinecap="round" />
      <rect x="116" y="334" width="68" height="22" rx="4" fill={SHADE} />
      <rect x="216" y="334" width="68" height="22" rx="4" fill={SHADE} />
      <path d="M200 160 L194 168 L184 352 L170 352 L188 170 Z" fill={SHADE} />
      <path d="M140 112 Q150 150 128 160" fill="none" stroke={DEEP} strokeWidth="3" />
      <path d="M260 112 Q250 150 272 160" fill="none" stroke={DEEP} strokeWidth="3" />
      <path d="M244 190 L270 196" stroke={c.ink} strokeWidth="3" strokeLinecap="round" />
      <rect x="238" y="192" width="38" height="40" rx="3" fill="none" stroke={SHADE} strokeWidth="2" />
      <path d="M140 230 Q148 270 138 320" fill="none" stroke={SHADE} strokeWidth="2" />
      <path d="M262 250 Q252 290 264 330" fill="none" stroke={SHADE} strokeWidth="2" />
      <Dumbbell x={146} y={250} w={30} color={c.ink} />
    </g>
  );
}

function Cap({ c }: ArtProps) {
  return (
    <g>
      <path d="M94 238 C94 116 306 116 306 238 Z" fill={c.hex} />
      <path d="M200 128 C162 150 150 200 152 238 L248 238 C250 200 238 150 200 128 Z" fill={LIGHT} />
      <path d="M200 128 C162 150 150 200 152 238 M200 128 C238 150 250 200 248 238" fill="none" stroke={SHADE} strokeWidth="2.5" />
      <path d="M94 238 C94 170 140 136 200 128" fill="none" stroke={SHADE} strokeWidth="2" opacity="0.6" />
      <circle cx="200" cy="127" r="7" fill={c.hex} />
      <circle cx="200" cy="127" r="7" fill={SHADE} />
      <path d="M82 236 Q200 214 318 236 Q340 256 306 270 Q200 296 94 270 Q60 256 82 236 Z" fill={c.hex} />
      <path d="M82 236 Q200 214 318 236 Q340 256 306 270 Q200 296 94 270 Q60 256 82 236 Z" fill={DEEP} opacity="0.55" />
      <path d="M96 246 Q200 230 304 246" fill="none" stroke={LIGHT} strokeWidth="2" strokeDasharray="5 4" />
      <Dumbbell x={200} y={192} w={72} color={c.ink} />
    </g>
  );
}

function Shaker({ c, print }: ArtProps) {
  return (
    <g>
      <rect x="168" y="44" width="64" height="20" rx="10" fill="none" stroke={STEEL} strokeWidth="8" />
      <path d="M150 64 L250 64 L256 92 L144 92 Z" fill={c.ink === '#1b1b1d' ? '#2a2a2e' : '#141416'} />
      <rect x="132" y="90" width="136" height="38" rx="6" fill={c.ink === '#1b1b1d' ? '#2a2a2e' : '#141416'} />
      <path d="M136 126 L264 126 L256 344 Q255 356 242 356 L158 356 Q145 356 144 344 Z" fill={c.hex} />
      <path d="M136 126 L264 126 L262 150 L138 150 Z" fill={SHADE} />
      <path d="M150 150 L158 346 L172 346 L166 150 Z" fill={LIGHT} />
      <path d="M244 150 L238 346 L250 346 L256 150 Z" fill={SHADE} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={236} y={176 + i * 22} width={i % 2 ? 10 : 16} height={2.5} fill={c.ink} opacity="0.8" />
      ))}
      {print && (
        <text
          x={198}
          y={260}
          textAnchor="middle"
          fontFamily={DISPLAY}
          fontWeight={900}
          fontSize={28}
          fill={c.ink}
          transform="rotate(-90 198 260)"
          letterSpacing="2"
        >
          {print}
        </text>
      )}
    </g>
  );
}

function Strap({ x, rot, c }: { x: number; rot: number; c: ColorOption }) {
  return (
    <g transform={`rotate(${rot} 200 200)`}>
      <rect x={x} y="56" width="52" height="300" rx="10" fill={c.hex} />
      <rect x={x} y="56" width="52" height="300" rx="10" fill="none" stroke={SHADE} strokeWidth="2" />
      <rect x={x + 6} y="62" width="40" height="288" rx="6" fill="none" stroke={c.ink} strokeWidth="1.5" strokeDasharray="5 4" />
      <rect x={x - 4} y="236" width="60" height="96" rx="12" fill="#121214" />
      <rect x={x + 2} y="242" width="48" height="84" rx="8" fill="none" stroke={c.ink} strokeWidth="1.5" strokeDasharray="4 4" />
      <rect x={x + 8} y="270" width="36" height="28" rx="3" fill={c.ink} />
      <Dumbbell x={x + 26} y={284} w={26} color="#121214" />
      <rect x={x} y="56" width="52" height="42" rx="10" fill={SHADE} />
      <path d={`M${x + 4} 96 L${x + 48} 96`} stroke={DEEP} strokeWidth="3" />
    </g>
  );
}

function Straps({ c }: ArtProps) {
  return (
    <g>
      <Strap x={112} rot={-14} c={c} />
      <Strap x={232} rot={12} c={c} />
    </g>
  );
}

function Belt({ c, uid }: ArtProps) {
  const pathId = `belt-arc-${uid}`;
  return (
    <g>
      <ellipse cx="200" cy="196" rx="160" ry="66" fill="#3a2b1f" />
      <ellipse cx="200" cy="196" rx="160" ry="66" fill="none" stroke={c.hex} strokeWidth="6" />
      <path d="M40 196 A160 66 0 0 0 360 196 L360 270 A160 66 0 0 1 40 270 Z" fill={c.hex} />
      <path d="M40 196 A160 66 0 0 0 120 252 L120 326 A160 66 0 0 1 40 270 Z" fill={SHADE} />
      <path d="M360 196 A160 66 0 0 1 300 248 L300 322 A160 66 0 0 0 360 270 Z" fill={DEEP} opacity="0.6" />
      <path d="M44 206 A156 62 0 0 0 356 206" fill="none" stroke={c.ink} strokeWidth="1.5" strokeDasharray="6 5" />
      <path d="M44 260 A156 62 0 0 0 356 260" fill="none" stroke={c.ink} strokeWidth="1.5" strokeDasharray="6 5" />
      <path id={pathId} d="M40 238 A160 66 0 0 0 360 238" fill="none" />
      <text fontFamily={DISPLAY} fontWeight={900} fontSize="24" fill={c.ink} letterSpacing="3">
        <textPath href={`#${pathId}`} startOffset="24%" textAnchor="middle">
          GYMAHOLIC
        </textPath>
      </text>
      <text fontFamily={DISPLAY} fontWeight={900} fontSize="24" fill={c.ink} letterSpacing="3">
        <textPath href={`#${pathId}`} startOffset="78%" textAnchor="middle">
          10MM
        </textPath>
      </text>
      <rect x="164" y="254" width="72" height="92" rx="6" fill={STEEL} />
      <rect x="164" y="254" width="72" height="92" rx="6" fill="none" stroke="#5b5d61" strokeWidth="2" />
      <rect x="176" y="266" width="48" height="68" rx="4" fill="#8c8e92" />
      <rect x="186" y="276" width="28" height="48" rx="3" fill="#5b5d61" />
      <circle cx="178" cy="262" r="3" fill="#5b5d61" />
      <circle cx="222" cy="262" r="3" fill="#5b5d61" />
      <circle cx="178" cy="338" r="3" fill="#5b5d61" />
      <circle cx="222" cy="338" r="3" fill="#5b5d61" />
    </g>
  );
}

function Chalk({ c }: ArtProps) {
  return (
    <g>
      <path d="M118 150 L282 150 L272 334 Q200 356 128 334 Z" fill={c.hex} />
      <path d="M118 150 L282 150 L280 186 L120 186 Z" fill={SHADE} />
      <path d="M128 334 Q200 356 272 334 L274 312 Q200 334 126 312 Z" fill={SHADE} />
      <path d="M132 190 L140 330 L156 334 L150 190 Z" fill={LIGHT} />
      <ellipse cx="200" cy="150" rx="84" ry="22" fill="#d9d6cf" />
      <ellipse cx="200" cy="150" rx="66" ry="14" fill="#141416" />
      <path d="M168 150 L182 104 L232 112 L226 150 Z" fill="#f6f5f1" />
      <path d="M182 104 L232 112 L236 120 L186 112 Z" fill="#ffffff" />
      <circle cx="196" cy="128" r="3" fill="#ddd" />
      <circle cx="214" cy="136" r="2.5" fill="#ddd" />
      <path d="M130 168 Q100 200 120 230" fill="none" stroke={STEEL} strokeWidth="4" strokeLinecap="round" />
      <rect x="112" y="226" width="16" height="22" rx="4" fill={c.ink} />
      <path d="M286 200 L306 196 L310 268 L290 272" fill="none" stroke={DEEP} strokeWidth="6" strokeLinejoin="round" />
      <rect x="164" y="232" width="72" height="44" rx="4" fill={c.ink} />
      <Dumbbell x={200} y={254} w={52} color={c.hex} />
    </g>
  );
}

function Coil({ cx, cy, r, c }: { cx: number; cy: number; r: number; c: ColorOption }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={c.hex} />
      {[0.8, 0.6, 0.4].map((k) => (
        <circle key={k} cx={cx} cy={cy} r={r * k} fill="none" stroke={SHADE} strokeWidth="3" />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.2} fill="#121214" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={c.ink} strokeWidth="5" strokeDasharray="14 10" opacity="0.85" />
    </g>
  );
}

function Wraps({ c }: ArtProps) {
  return (
    <g>
      <path d="M150 288 L320 300 L318 342 L148 330 Z" fill={c.hex} />
      <path d="M150 288 L320 300 L318 342 L148 330 Z" fill={SHADE} />
      <rect x="282" y="296" width="44" height="48" rx="4" fill="#3d3e42" transform="rotate(4 304 320)" />
      <path d="M320 304 Q360 300 358 322 Q356 344 318 338" fill="none" stroke={STEEL} strokeWidth="5" />
      <path d="M150 300 L318 312" stroke={c.ink} strokeWidth="4" opacity="0.7" />
      <Coil cx={150} cy={226} r={78} c={c} />
      <Coil cx={268} cy={168} r={64} c={c} />
    </g>
  );
}

function Duffel({ c, print }: ArtProps) {
  return (
    <g>
      <path d="M118 170 Q120 60 200 58 Q280 60 282 170" fill="none" stroke={DEEP} strokeWidth="14" strokeLinecap="round" />
      <path d="M118 170 Q120 60 200 58 Q280 60 282 170" fill="none" stroke={c.hex} strokeWidth="10" strokeLinecap="round" />
      <path d="M150 156 Q152 104 176 104 M250 156 Q248 104 224 104" fill="none" stroke={DEEP} strokeWidth="10" strokeLinecap="round" />
      <path d="M176 104 L224 104" stroke={DEEP} strokeWidth="14" strokeLinecap="round" />
      <path d="M62 184 Q62 144 102 144 L298 144 Q338 144 338 184 L338 308 Q338 334 312 334 L88 334 Q62 334 62 308 Z" fill={c.hex} />
      <path d="M62 290 L338 290 L338 308 Q338 334 312 334 L88 334 Q62 334 62 308 Z" fill={SHADE} />
      <path d="M90 146 L310 146" stroke={STEEL} strokeWidth="3" strokeDasharray="3 2" />
      <rect x="252" y="138" width="10" height="22" rx="2" fill={STEEL} />
      <path d="M62 184 Q62 144 102 144 L110 144 Q86 150 84 190 L84 320 Q70 316 62 308 Z" fill={SHADE} />
      <path d="M300 180 Q322 238 300 296" fill="none" stroke={STEEL} strokeWidth="3" strokeDasharray="3 2" />
      <path d="M296 178 Q330 238 296 300 L338 300 L338 178 Z" fill={DEEP} opacity="0.35" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={318} cy={214 + i * 22} r={3} fill="#0d0d0e" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={112} y={196 + i * 9} width={168} height={4} fill={c.ink} opacity={0.9} />
      ))}
      {print && <PrintText text={print} x={196} y={270} size={30} color={c.ink} spacing={3} maxWidth={180} />}
    </g>
  );
}

function Towel({ c, print }: ArtProps) {
  return (
    <g>
      <rect x="30" y="92" width="340" height="14" rx="7" fill={STEEL} />
      <rect x="30" y="92" width="340" height="5" rx="2.5" fill="#d4d5d7" />
      <rect x="40" y="80" width="18" height="38" rx="3" fill="#5b5d61" />
      <rect x="342" y="80" width="18" height="38" rx="3" fill="#5b5d61" />
      <path d="M128 100 L284 100 L292 296 L136 300 Z" fill={c.hex} />
      <path d="M128 100 L284 100 L292 296 L136 300 Z" fill={DEEP} opacity="0.55" />
      <path d="M110 104 Q200 92 290 104 L298 344 Q246 356 200 348 Q150 358 104 346 Z" fill={c.hex} />
      <path d="M110 104 Q200 92 290 104 L290 122 Q200 110 110 122 Z" fill={SHADE} />
      <path d="M140 130 Q150 240 136 340" fill="none" stroke={SHADE} strokeWidth="3" opacity="0.6" />
      <path d="M262 130 Q252 240 266 340" fill="none" stroke={SHADE} strokeWidth="3" opacity="0.5" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={106} y={300 + i * 10} width={190} height={5} fill={c.ink} opacity={0.9} />
      ))}
      {print && <PrintText text={print} x={200} y={214} size={24} color={c.ink} spacing={2} maxWidth={170} />}
      <Dumbbell x={200} y={174} w={54} color={c.ink} />
    </g>
  );
}

const ART: Record<ArtKind, (p: ArtProps) => React.JSX.Element> = {
  tee: Tee,
  hoodie: Hoodie,
  tank: Tank,
  jogger: Jogger,
  cap: Cap,
  shaker: Shaker,
  straps: Straps,
  belt: Belt,
  chalk: Chalk,
  wraps: Wraps,
  duffel: Duffel,
  towel: Towel,
};

export function ProductArt({
  product,
  colorId,
  className,
}: {
  product: Product;
  colorId?: string;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const Art = ART[product.art];
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      role="img"
      aria-label={`${product.name} in ${color.name}`}
    >
      <ellipse cx="200" cy="368" rx="150" ry="14" fill="rgba(0,0,0,0.35)" />
      <Art c={color} print={product.print} uid={uid} />
    </svg>
  );
}
