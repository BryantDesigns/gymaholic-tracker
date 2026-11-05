import { useEffect } from 'react';

const DEFAULT_DESCRIPTION =
  'Heavyweight gym apparel, lifting straps, belts and shakers, plus a free meal and protein tracker. Built for people who plan their week around leg day.';

/**
 * Per-page <title> (hoisted into <head> by React 19) and description.
 * The description updates the single static tag in index.html rather than
 * adding a second one. Open Graph tags stay static in index.html because
 * social crawlers don't run JavaScript.
 */
export function Meta({ title, description }: { title?: string; description?: string }) {
  const full = title ? `${title} | Gymaholic` : 'Gymaholic | Gym Apparel, Lifting Gear & Fuel Log';

  useEffect(() => {
    let tag = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.append(tag);
    }
    tag.content = description ?? DEFAULT_DESCRIPTION;
  }, [description]);

  return <title>{full}</title>;
}
