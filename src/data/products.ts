/**
 * Product catalog.
 *
 * This file is the single source of truth for prices. It is imported by the
 * storefront *and* by the checkout function (netlify/functions), so the
 * server never trusts a price sent from the browser.
 */

export type Category = 'apparel' | 'gear' | 'accessories';

export type ArtKind =
  | 'tee'
  | 'hoodie'
  | 'tank'
  | 'jogger'
  | 'cap'
  | 'shaker'
  | 'straps'
  | 'belt'
  | 'chalk'
  | 'wraps'
  | 'duffel'
  | 'towel';

export interface ColorOption {
  id: string;
  name: string;
  /** Main garment / product colour. */
  hex: string;
  /** Colour used for the print or accent on top of the product. */
  ink: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: Category;
  art: ArtKind;
  /** Price in cents (USD). */
  price: number;
  colors: ColorOption[];
  /** Empty array means one-size. */
  sizes: string[];
  description: string;
  details: string[];
  /** Short text printed on the product illustration. */
  print?: string;
  badge?: 'New' | 'Bestseller' | 'Limited';
  featured?: boolean;
}

const IRON: ColorOption = { id: 'iron', name: 'Iron Black', hex: '#1b1b1d', ink: '#c49a6c' };
const CHALK: ColorOption = { id: 'chalk', name: 'Chalk White', hex: '#ecebe6', ink: '#1b1b1d' };
const BRONZE: ColorOption = { id: 'bronze', name: 'Bronze', hex: '#b8875a', ink: '#1b1b1d' };
const STEEL: ColorOption = { id: 'steel', name: 'Steel Grey', hex: '#7d7f84', ink: '#ecebe6' };
const OXBLOOD: ColorOption = { id: 'oxblood', name: 'Oxblood', hex: '#5c1f22', ink: '#e3c29b' };
const OLIVE: ColorOption = { id: 'olive', name: 'Field Olive', hex: '#4a4b36', ink: '#e3c29b' };

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

export const products: Product[] = [
  {
    id: 'gh-tee-iron-faithful',
    slug: 'iron-faithful-heavyweight-tee',
    name: 'Iron Faithful Heavyweight Tee',
    tagline: '300 GSM. Built like a squat rack.',
    category: 'apparel',
    art: 'tee',
    price: 3400,
    colors: [CHALK, IRON, OXBLOOD],
    sizes: APPAREL_SIZES,
    print: 'IRON FAITHFUL',
    badge: 'Bestseller',
    featured: true,
    description:
      'The tee we wear on heavy day. Thick 300 GSM cotton jersey with a boxy, dropped-shoulder cut that leaves room for your lats, and doesn\'t go see-through after six months of chalk and sweat.',
    details: [
      '100% ring-spun cotton, 300 GSM',
      'Boxy fit with dropped shoulders',
      'Pre-shrunk, so wash it hot without worry',
      'Screen-printed chest graphic',
    ],
  },
  {
    id: 'gh-hoodie-plate-stack',
    slug: 'plate-stack-oversized-hoodie',
    name: 'Plate Stack Oversized Hoodie',
    tagline: 'Warm-up sets. Cold mornings. Every rest day.',
    category: 'apparel',
    art: 'hoodie',
    price: 6800,
    colors: [STEEL, IRON, OLIVE],
    sizes: APPAREL_SIZES,
    print: 'GYMAHOLIC',
    badge: 'New',
    featured: true,
    description:
      'A 450 GSM brushed-fleece hoodie for 5 a.m. walks to the gym. The oversized body and double-lined hood are made for layering, and the ribbed cuffs stay put when you push the sleeves up between sets.',
    details: [
      '80% cotton / 20% polyester brushed fleece, 450 GSM',
      'Oversized fit, size down for regular',
      'Double-lined hood, no drawcords to snag',
      'Kangaroo pocket fits a phone and a pre-workout scoop',
    ],
  },
  {
    id: 'gh-tank-chalk-iron',
    slug: 'chalk-and-iron-stringer',
    name: 'Chalk & Iron Stringer',
    tagline: 'Maximum range of motion. Minimum fabric.',
    category: 'apparel',
    art: 'tank',
    price: 2800,
    colors: [IRON, CHALK, BRONZE],
    sizes: APPAREL_SIZES,
    print: 'NO DAYS OFF',
    description:
      'A deep-cut stringer made for pump days and summer sessions. Lightweight tri-blend fabric that dries fast and a racerback that stays out of the way on overhead work.',
    details: [
      '50% polyester / 25% cotton / 25% rayon tri-blend',
      'Deep armholes, racerback',
      'Quick-dry, anti-cling finish',
      'Water-based print stays soft',
    ],
  },
  {
    id: 'gh-jogger-rest-day',
    slug: 'rest-day-joggers',
    name: 'Rest Day Joggers',
    tagline: 'Tapered, stretchy, squat-proof.',
    category: 'apparel',
    art: 'jogger',
    price: 5800,
    colors: [IRON, STEEL],
    sizes: APPAREL_SIZES,
    description:
      'A gusseted crotch and four-way stretch let you hit depth without a seam giving up. Tapered at the ankle, with a zip pocket that keeps your keys from flying out on the treadmill.',
    details: [
      '88% nylon / 12% spandex four-way stretch',
      'Gusseted crotch for full-depth squats',
      'Zip thigh pocket and two hand pockets',
      'Elastic waistband with internal drawcord',
    ],
  },
  {
    id: 'gh-cap-dumbbell',
    slug: 'dumbbell-dad-cap',
    name: 'Dumbbell Dad Cap',
    tagline: 'Embroidered. Unstructured. Unbothered.',
    category: 'accessories',
    art: 'cap',
    price: 3000,
    colors: [OLIVE, IRON, CHALK],
    sizes: [],
    description:
      'A washed-cotton six-panel cap with an embroidered dumbbell, the same one that stands in for the H in our logo. Brass buckle strap, curved brim, and it looks better the more you wear it.',
    details: [
      '100% washed cotton twill',
      'Raised 3D embroidery',
      'Adjustable strap with antique brass buckle',
      'One size fits most',
    ],
  },
  {
    id: 'gh-shaker-bronze-bar',
    slug: 'bronze-bar-shaker',
    name: 'Bronze Bar Shaker · 28 oz',
    tagline: 'Leak-proof. Clump-proof. Gym-bag-proof.',
    category: 'gear',
    art: 'shaker',
    price: 2200,
    colors: [BRONZE, IRON, CHALK],
    sizes: [],
    print: 'GYMAHOLIC',
    badge: 'Bestseller',
    featured: true,
    description:
      'A 28 oz shaker with a stainless whisk ball and a screw-lock lid that won\'t leak protein into your bag. BPA-free and dishwasher-safe, with measurement marks up to 600 mL.',
    details: [
      '28 oz / 830 mL capacity',
      'BPA-free Tritan body',
      'Stainless steel whisk ball',
      'Leak-proof screw lid with carry loop',
    ],
  },
  {
    id: 'gh-straps-death-grip',
    slug: 'death-grip-lifting-straps',
    name: 'Death Grip Lifting Straps',
    tagline: 'Your back gives out before your grip does.',
    category: 'gear',
    art: 'straps',
    price: 2400,
    colors: [IRON, BRONZE],
    sizes: [],
    featured: true,
    description:
      'Heavy cotton-nylon lasso straps with neoprene wrist padding. When your hands give out before your back does, these let you finish the set. Long enough to wrap a thick bar twice.',
    details: [
      'Cotton/nylon blend webbing, 23 in length',
      '5 mm neoprene wrist padding',
      'Reinforced double stitching',
      'Sold as a pair',
    ],
  },
  {
    id: 'gh-belt-lever',
    slug: 'gymaholic-10mm-lever-belt',
    name: '10mm Lever Belt',
    tagline: 'Brace hard. Click once. Pull heavy.',
    category: 'gear',
    art: 'belt',
    price: 12900,
    colors: [OXBLOOD, IRON],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'Limited',
    featured: true,
    description:
      'A 4-inch, 10 mm vegetable-tanned leather belt with a steel lever buckle. Same width all the way round, suede-lined, and stiff for the first month until it breaks in to fit you.',
    details: [
      '10 mm vegetable-tanned leather, suede lined',
      'Uniform 4 in width',
      'Zinc-plated steel lever buckle',
      'Sizing: measure around your navel (see size guide)',
    ],
  },
  {
    id: 'gh-chalk-bag',
    slug: 'chalk-bag-and-block',
    name: 'Chalk Bag + Block',
    tagline: 'Less slip. More grip. Some mess.',
    category: 'gear',
    art: 'chalk',
    price: 1800,
    colors: [OLIVE, IRON],
    sizes: [],
    description:
      'A drawstring chalk bag in waxed canvas with a brush loop and belt clip, plus a 2 oz block of pure magnesium carbonate. Cinch it shut and the chalk stays in the bag.',
    details: [
      'Waxed canvas with fleece lining',
      'Includes 2 oz magnesium carbonate block',
      'Drawstring closure and belt clip',
      'Brush loop on side',
    ],
  },
  {
    id: 'gh-wraps-wrist',
    slug: 'wrist-wraps',
    name: 'Stiff Wrist Wraps · 18"',
    tagline: 'For when the bar is heavier than your excuses.',
    category: 'gear',
    art: 'wraps',
    price: 2200,
    colors: [BRONZE, IRON, OXBLOOD],
    sizes: [],
    description:
      'Stiff 18-inch wraps with a thumb loop and heavy hook-and-loop closure. Pull them tight for heavy pressing or wrap them loose for volume work.',
    details: [
      'Stiff elastic blend, 18 in length',
      'Thumb loop and wide hook-and-loop closure',
      'Competition-friendly length',
      'Sold as a pair',
    ],
  },
  {
    id: 'gh-duffel-locker',
    slug: 'locker-room-duffel',
    name: 'Locker Room Duffel',
    tagline: 'Fits shoes, belt, shaker and the post-lift snacks.',
    category: 'accessories',
    art: 'duffel',
    price: 7900,
    colors: [OLIVE, IRON],
    sizes: [],
    print: 'GYMAHOLIC',
    featured: true,
    description:
      'A 40 L duffel in water-resistant 900D polyester with a ventilated shoe tunnel, so your clean clothes stay away from your sweaty shoes. Padded shoulder strap and a wide mouth you can see into.',
    details: [
      '40 L, 900D water-resistant polyester',
      'Ventilated shoe compartment',
      'Interior zip pocket and bottle sleeve',
      'Detachable padded shoulder strap',
    ],
  },
  {
    id: 'gh-towel-sweat',
    slug: 'sweat-equity-gym-towel',
    name: 'Sweat Equity Gym Towel',
    tagline: 'Wipe the bench. Seriously.',
    category: 'accessories',
    art: 'towel',
    price: 1600,
    colors: [CHALK, IRON],
    sizes: [],
    print: 'WIPE THE BENCH',
    description:
      'A quick-dry microfibre towel, big enough for the bench and small enough for your back pocket. It comes with a clip loop for the side of your bag.',
    details: [
      'Microfibre, 16 × 32 in',
      'Quick-dry, odour resistant',
      'Clip loop for bag or rack',
      'Woven jacquard print',
    ],
  },
];

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'gear', label: 'Lifting Gear' },
  { id: 'accessories', label: 'Accessories' },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Free shipping threshold, in cents. */
export const FREE_SHIPPING_THRESHOLD = 7500;
/** Flat shipping rate below the threshold, in cents. */
export const FLAT_SHIPPING = 695;
