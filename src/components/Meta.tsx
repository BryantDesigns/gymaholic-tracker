/** Per-page <title> and description. React 19 hoists these into <head>. */
export function Meta({ title, description }: { title?: string; description?: string }) {
  const full = title ? `${title} | Gymaholic` : 'Gymaholic | Gym Apparel, Lifting Gear & Fuel Log';
  return (
    <>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={full} />
      {description && <meta property="og:description" content={description} />}
    </>
  );
}
